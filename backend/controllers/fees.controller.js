const FeeStructure = require("../models/feeStructure.model");
const FeePayment = require("../models/feePayment.model");
const Student = require("../models/details/student-details.model");
const StudentGroup = require("../models/studentGroup.model");

// Helper function to calculate late fee
const calculateLateFee = (feeStructure) => {
    if (!feeStructure) {
        return {
            isLate: false,
            totalAmount: 0,
            lateFee: 0,
        };
    }
    const today = new Date();
    const lastDate = new Date(feeStructure.lastDate);
    const isLate = today > lastDate;

    return {
        isLate,
        totalAmount:
            feeStructure.amount + (isLate ? feeStructure.lateFee || 0 : 0),
        lateFee: isLate ? feeStructure.lateFee || 0 : 0,
    };
};

// @desc    Create a new fee structure
// @route   POST /api/fees
// @access  Admin only
const createFeeStructure = async (req, res) => {
    try {
        const {
            title,
            description,
            amount,
            lastDate,
            lateFee,
            targetType,
            targets,
        } = req.body;

        // Validate required fields
        if (!title || !amount || !lastDate || !targetType) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate target type vs targets
        if (
            targetType !== "ALL" &&
            (!targets || Object.keys(targets).length === 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide targets for the selected target type",
            });
        }

        // Create fee structure
        const feeStructure = await FeeStructure.create({
            title,
            description,
            amount,
            lastDate,
            lateFee: lateFee || 0,
            targetType,
            targets: targets || {},
            createdBy: req.userId,
        });

        res.status(201).json({
            success: true,
            message: "Fee structure created successfully",
            data: feeStructure,
        });
    } catch (error) {
        console.error("Create fee structure error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create fee structure",
        });
    }
};

// @desc    Get all fee structures (Admin)
// @route   GET /api/fees
// @access  Admin only
const getAllFeeStructures = async (req, res) => {
    try {
        const { page = 1, limit = 20, isActive } = req.query;

        const query = {};
        if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }

        const feeStructures = await FeeStructure.find(query)
            .populate("targets.branches", "name")
            .populate("targets.students", "firstName lastName enrollmentNo")
            .populate("targets.groups", "name")
            .populate("createdBy", "username")
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await FeeStructure.countDocuments(query);

        res.status(200).json({
            success: true,
            data: feeStructures,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error("Get fee structures error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch fee structures",
        });
    }
};

// @desc    Get applicable fees for student
// @route   GET /api/fees/student
// @access  Student only
const getStudentFees = async (req, res) => {
    try {
        const studentId = req.userId;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Build query to find applicable fee structures
        const query = {
            isActive: true,
            $or: [
                { targetType: "ALL" },
                {
                    targetType: "BRANCH",
                    "targets.branches": student.branchId,
                },
                {
                    targetType: "SEMESTER",
                    "targets.semesters": student.semester,
                },
                {
                    targetType: "INDIVIDUAL",
                    "targets.students": studentId,
                },
            ],
        };

        // Check group memberships
        const studentGroups = await StudentGroup.find({
            students: { $in: [studentId] },
        });
        const groupIds = studentGroups.map((g) => g._id);

        if (groupIds.length > 0) {
            query.$or.push({
                targetType: "GROUP",
                "targets.groups": { $in: groupIds },
            });
        }

        const feeStructures = await FeeStructure.find(query).sort({
            createdAt: -1,
        });

        // Get existing payments for this student
        const payments = await FeePayment.find({
            student: studentId,
        }).populate("feeStructure");

        const paymentMap = {};
        payments.forEach((payment) => {
            paymentMap[payment.feeStructure._id.toString()] = payment;
        });

        // Calculate late fees and attach payment status
        const feesWithStatus = feeStructures.map((fee) => {
            const feeObj = fee.toObject();
            const lateFeeCalc = calculateLateFee(fee);
            const payment = paymentMap[fee._id.toString()];

            return {
                ...feeObj,
                totalAmount: lateFeeCalc.totalAmount,
                isLate: lateFeeCalc.isLate,
                lateFeeAmount: lateFeeCalc.lateFee,
                paymentStatus: payment ? payment.status : null,
                paymentId: payment ? payment._id : null,
                paidAt: payment ? payment.submittedAt : null,
                receiptUrl: payment ? payment.receiptUrl : null,
                verifiedAt: payment ? payment.verifiedAt : null,
            };
        });

        res.status(200).json({
            success: true,
            data: feesWithStatus,
        });
    } catch (error) {
        console.error("Get student fees error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch fees",
        });
    }
};

// @desc    Submit fee payment
// @route   POST /api/fees/pay
// @access  Student only
const submitPayment = async (req, res) => {
    try {
        const { feeStructureId, amountPaid } = req.body;
        const studentId = req.userId;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Receipt is required",
            });
        }

        // Check if fee structure exists
        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure) {
            return res.status(404).json({
                success: false,
                message: "Fee structure not found",
            });
        }

        // Check if already paid
        const existingPayment = await FeePayment.findOne({
            student: studentId,
            feeStructure: feeStructureId,
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted payment for this fee",
            });
        }

        // Calculate total amount with late fee
        const lateFeeCalc = calculateLateFee(feeStructure);

        // Validate amount
        if (Number(amountPaid) < lateFeeCalc.totalAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum amount required is ${lateFeeCalc.totalAmount} (including late fee if applicable)`,
            });
        }

        // Create receipt URL from Cloudinary
        const receiptUrl = req.file.path;

        // Create payment
        const payment = await FeePayment.create({
            student: studentId,
            feeStructure: feeStructureId,
            amountPaid: Number(amountPaid),
            receiptUrl,
            status: "PENDING",
        });

        res.status(201).json({
            success: true,
            message: "Payment submitted successfully. Awaiting verification.",
            data: payment,
        });
    } catch (error) {
        console.error("Submit payment error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to submit payment",
        });
    }
};

// @desc    Get all payments for verification (Admin)
// @route   GET /api/fees/payments
// @access  Admin only
const getAllPayments = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, feeStructureId } = req.query;

        const query = {};
        if (status) query.status = status;
        if (feeStructureId) query.feeStructure = feeStructureId;

        const payments = await FeePayment.find(query)
            .populate(
                "student",
                "firstName lastName enrollmentNo branchId semester",
            )
            .populate("feeStructure", "title amount lastDate lateFee")
            .populate("verifiedBy", "username")
            .sort({ submittedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await FeePayment.countDocuments(query);

        // Calculate late fees
        const paymentsWithLateFee = payments.map((payment) => {
            const paymentObj = payment.toObject();
            const lateFeeCalc = calculateLateFee(payment.feeStructure);
            return {
                ...paymentObj,
                expectedAmount: lateFeeCalc.totalAmount,
                isLate: lateFeeCalc.isLate,
            };
        });

        res.status(200).json({
            success: true,
            data: paymentsWithLateFee,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch payments",
        });
    }
};

// @desc    Verify/Reject payment (Admin)
// @route   PATCH /api/fees/verify/:paymentId
// @access  Admin only
const verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status, remarks } = req.body;

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be APPROVED or REJECTED",
            });
        }

        const payment = await FeePayment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        if (payment.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `Payment has already been ${payment.status.toLowerCase()}`,
            });
        }

        payment.status = status;
        payment.remarks = remarks || "";
        payment.verifiedBy = req.userId;
        payment.verifiedAt = new Date();

        await payment.save();

        res.status(200).json({
            success: true,
            message: `Payment ${status.toLowerCase()} successfully`,
            data: payment,
        });
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to verify payment",
        });
    }
};

// @desc    Delete fee structure (Admin)
// @route   DELETE /api/fees/:feeId
// @access  Admin only
const deleteFeeStructure = async (req, res) => {
    try {
        const { feeId } = req.params;

        // Check if any payments exist for this fee
        const paymentCount = await FeePayment.countDocuments({
            feeStructure: feeId,
        });

        if (paymentCount > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete fee with existing payments. Deactivate instead.",
            });
        }

        const feeStructure = await FeeStructure.findByIdAndDelete(feeId);

        if (!feeStructure) {
            return res.status(404).json({
                success: false,
                message: "Fee structure not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Fee structure deleted successfully",
        });
    } catch (error) {
        console.error("Delete fee structure error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete fee structure",
        });
    }
};

// @desc    Toggle fee structure active status
// @route   PATCH /api/fees/:feeId/toggle
// @access  Admin only
const toggleFeeStatus = async (req, res) => {
    try {
        const { feeId } = req.params;

        const feeStructure = await FeeStructure.findById(feeId);

        if (!feeStructure) {
            return res.status(404).json({
                success: false,
                message: "Fee structure not found",
            });
        }

        feeStructure.isActive = !feeStructure.isActive;
        await feeStructure.save();

        res.status(200).json({
            success: true,
            message: `Fee structure ${feeStructure.isActive ? "activated" : "deactivated"} successfully`,
            data: feeStructure,
        });
    } catch (error) {
        console.error("Toggle fee status error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to toggle fee status",
        });
    }
};

// @desc    Get detailed fee structure with payment breakdown
// @route   GET /api/fees/:feeId/details
// @access  Admin only
const getFeeStructureDetails = async (req, res) => {
    try {
        const { feeId } = req.params;

        const feeStructure = await FeeStructure.findById(feeId)
            .populate("targets.branches", "name")
            .populate("targets.students", "firstName lastName enrollmentNo")
            .populate("targets.groups", "name")
            .populate("createdBy", "username");

        if (!feeStructure) {
            return res.status(404).json({
                success: false,
                message: "Fee structure not found",
            });
        }

        // Get all targeted students based on fee structure's target type
        let targetedStudents = [];

        if (feeStructure.targetType === "ALL") {
            const allStudents = await Student.find({});
            targetedStudents = allStudents.map((s) => s._id);
        } else if (feeStructure.targetType === "BRANCH") {
            const studentsInBranches = await Student.find({
                branchId: { $in: feeStructure.targets.branches },
            });
            targetedStudents = studentsInBranches.map((s) => s._id);
        } else if (feeStructure.targetType === "SEMESTER") {
            const studentsInSemesters = await Student.find({
                semester: { $in: feeStructure.targets.semesters },
            });
            targetedStudents = studentsInSemesters.map((s) => s._id);
        } else if (feeStructure.targetType === "INDIVIDUAL") {
            targetedStudents = feeStructure.targets.students;
        } else if (feeStructure.targetType === "GROUP") {
            // Get students from groups
            const groups = await StudentGroup.find({
                _id: { $in: feeStructure.targets.groups },
            });
            const groupStudentIds = groups.flatMap((g) => g.students);
            targetedStudents = groupStudentIds;
        }

        // Get all payments for this fee structure
        const payments = await FeePayment.find({
            feeStructure: feeId,
            student: { $in: targetedStudents },
        })
            .populate(
                "student",
                "firstName lastName enrollmentNo branchId semester",
            )
            .populate("verifiedBy", "username")
            .sort({ submittedAt: -1 });

        // Calculate payment statistics
        const totalTargeted = targetedStudents.length;
        const paidStudents = payments.filter(
            (p) => p.status === "APPROVED",
        ).length;
        const pendingStudents = payments.filter(
            (p) => p.status === "PENDING",
        ).length;
        const rejectedStudents = payments.filter(
            (p) => p.status === "REJECTED",
        ).length;
        const unpaidStudents = totalTargeted - payments.length;

        // Calculate revenue
        const totalRevenue = payments
            .filter((p) => p.status === "APPROVED")
            .reduce((sum, p) => sum + p.amountPaid, 0);

        const expectedRevenue = totalTargeted * feeStructure.amount;
        const pendingRevenue = payments
            .filter((p) => p.status === "PENDING")
            .reduce((sum, p) => sum + p.amountPaid, 0);

        // Get detailed student list with payment status
        const studentDetails = targetedStudents.map((studentId) => {
            const payment = payments.find(
                (p) => p.student._id.toString() === studentId.toString(),
            );
            const student = payment ? payment.student : null;

            return {
                studentId,
                studentInfo: student,
                paymentStatus: payment ? payment.status : "UNPAID",
                amountPaid: payment ? payment.amountPaid : 0,
                submittedAt: payment ? payment.submittedAt : null,
                verifiedAt: payment ? payment.verifiedAt : null,
                receiptUrl: payment ? payment.receiptUrl : null,
                remarks: payment ? payment.remarks : null,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                feeStructure,
                statistics: {
                    totalTargeted,
                    paidStudents,
                    pendingStudents,
                    rejectedStudents,
                    unpaidStudents,
                    completionRate:
                        totalTargeted > 0
                            ? ((paidStudents / totalTargeted) * 100).toFixed(1)
                            : 0,
                },
                revenue: {
                    expectedRevenue,
                    totalRevenue,
                    pendingRevenue,
                    collectionRate:
                        expectedRevenue > 0
                            ? ((totalRevenue / expectedRevenue) * 100).toFixed(
                                  1,
                              )
                            : 0,
                },
                students: studentDetails,
                recentPayments: payments.slice(0, 10), // Last 10 payments
            },
        });
    } catch (error) {
        console.error("Get fee structure details error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch fee structure details",
        });
    }
};

module.exports = {
    createFeeStructure,
    getAllFeeStructures,
    getStudentFees,
    submitPayment,
    getAllPayments,
    verifyPayment,
    deleteFeeStructure,
    toggleFeeStatus,
    getFeeStructureDetails,
    calculateLateFee,
};
