import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
    FiPlus,
    FiFilter,
    FiSearch,
    FiEye,
    FiCheck,
    FiX,
    FiDollarSign,
    FiUsers,
    FiCalendar,
    FiFileText,
    FiTrash2,
    FiToggleRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import DataTable from "../../components/DataTable";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import axiosWrapper from "../../utils/AxiosWrapper";

const AdminFees = () => {
    const [fees, setFees] = useState([]);
    const [payments, setPayments] = useState([]);
    const [branches, setBranches] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("fees"); // fees, verify
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [verificationRemarks, setVerificationRemarks] = useState("");
    const [verificationLoading, setVerificationLoading] = useState(false);
    const userToken = localStorage.getItem("userToken");

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: "",
        lastDate: "",
        lateFee: "",
        targetType: "ALL",
        targets: {
            branches: [],
            semesters: [],
            students: [],
        },
    });

    const targetTypes = [
        { value: "ALL", label: "All Students" },
        { value: "BRANCH", label: "Specific Branches" },
        { value: "SEMESTER", label: "Specific Semesters" },
        { value: "INDIVIDUAL", label: "Individual Students" },
    ];

    const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

    useEffect(() => {
        fetchBranches();
        fetchFees();
    }, []);

    useEffect(() => {
        if (activeTab === "verify") {
            fetchPayments();
        }
    }, [activeTab]);

    const fetchBranches = async () => {
        try {
            const response = await axiosWrapper.get("/branch", {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setBranches(response.data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load branches");
        }
    };

    const fetchFees = async () => {
        setLoading(true);
        try {
            const response = await axiosWrapper.get("/fees", {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setFees(response.data.data || []);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load fees");
        } finally {
            setLoading(false);
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axiosWrapper.get("/fees/payments", {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setPayments(response.data.data || []);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load payments",
            );
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async (query) => {
        if (!query || query.length < 2) return;
        try {
            const response = await axiosWrapper.post(
                "/student/search",
                { name: query },
                { headers: { Authorization: `Bearer ${userToken}` } },
            );
            if (response.data.success) {
                setStudents(response.data.data || []);
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTargetChange = (type, value) => {
        setFormData((prev) => ({
            ...prev,
            targets: {
                ...prev.targets,
                [type]: value,
            },
        }));
    };

    const addStudent = (student) => {
        if (!formData.targets.students.find((s) => s._id === student._id)) {
            handleTargetChange("students", [
                ...formData.targets.students,
                student,
            ]);
        }
    };

    const removeStudent = (studentId) => {
        handleTargetChange(
            "students",
            formData.targets.students.filter((s) => s._id !== studentId),
        );
    };

    const handleCreateFee = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                amount: Number(formData.amount),
                lateFee: Number(formData.lateFee) || 0,
                targets: {
                    ...formData.targets,
                    students: formData.targets.students.map((s) => s._id),
                },
            };

            const response = await axiosWrapper.post("/fees", payload, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            if (response.data.success) {
                toast.success("Fee structure created successfully");
                setShowCreateModal(false);
                setFormData({
                    title: "",
                    description: "",
                    amount: "",
                    lastDate: "",
                    lateFee: "",
                    targetType: "ALL",
                    targets: { branches: [], semesters: [], students: [] },
                });
                fetchFees();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to create fee",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async (status) => {
        setVerificationLoading(true);
        try {
            const response = await axiosWrapper.patch(
                `/fees/verify/${selectedPayment._id}`,
                { status, remarks: verificationRemarks },
                { headers: { Authorization: `Bearer ${userToken}` } },
            );

            if (response.data.success) {
                toast.success(`Payment ${status.toLowerCase()} successfully`);
                setShowPaymentModal(false);
                setSelectedPayment(null);
                setVerificationRemarks("");
                fetchPayments();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to verify payment",
            );
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleToggleFeeStatus = async (feeId) => {
        try {
            const response = await axiosWrapper.patch(
                `/fees/${feeId}/toggle`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } },
            );
            if (response.data.success) {
                toast.success("Fee status updated");
                fetchFees();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteFee = async (feeId) => {
        if (!window.confirm("Are you sure you want to delete this fee?"))
            return;
        try {
            const response = await axiosWrapper.delete(`/fees/${feeId}`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                toast.success("Fee deleted successfully");
                fetchFees();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete fee",
            );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const feeColumns = useMemo(
        () => [
            {
                header: "Title",
                accessorKey: "title",
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">{row.original.title}</div>
                        <div className="text-sm text-gray-500">
                            {row.original.description?.substring(0, 50)}
                            {row.original.description?.length > 50 ? "..." : ""}
                        </div>
                    </div>
                ),
            },
            {
                header: "Amount",
                accessorKey: "amount",
                cell: ({ row }) => (
                    <span className="font-semibold text-green-600">
                        ₹{row.original.amount}
                    </span>
                ),
            },
            {
                header: "Last Date",
                accessorKey: "lastDate",
                cell: ({ row }) => formatDate(row.original.lastDate),
            },
            {
                header: "Target",
                accessorKey: "targetType",
                cell: ({ row }) => (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.original.targetType}
                    </span>
                ),
            },
            {
                header: "Status",
                accessorKey: "isActive",
                cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.original.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {row.original.isActive ? "Active" : "Inactive"}
                    </span>
                ),
            },
            {
                header: "Actions",
                accessorKey: "_id",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                handleToggleFeeStatus(row.original._id)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Toggle Status"
                        >
                            <FiToggleRight />
                        </button>
                        <button
                            onClick={() => handleDeleteFee(row.original._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const paymentColumns = useMemo(
        () => [
            {
                header: "Student",
                accessorKey: "student",
                cell: ({ row }) => (
                    <div>
                        <div className="font-medium">
                            {row.original.student?.firstName}{" "}
                            {row.original.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {row.original.student?.enrollmentNo}
                        </div>
                    </div>
                ),
            },
            {
                header: "Fee Title",
                accessorKey: "feeStructure.title",
            },
            {
                header: "Amount",
                accessorKey: "amountPaid",
                cell: ({ row }) => (
                    <span className="font-semibold">
                        ₹{row.original.amountPaid}
                    </span>
                ),
            },
            {
                header: "Expected",
                accessorKey: "expectedAmount",
                cell: ({ row }) => (
                    <div>
                        <span>₹{row.original.expectedAmount}</span>
                        {row.original.isLate && (
                            <span className="text-xs text-red-500 block">
                                Late fee applied
                            </span>
                        )}
                    </div>
                ),
            },
            {
                header: "Status",
                accessorKey: "status",
                cell: ({ row }) => {
                    const statusColors = {
                        PENDING: "bg-yellow-100 text-yellow-800",
                        APPROVED: "bg-green-100 text-green-800",
                        REJECTED: "bg-red-100 text-red-800",
                    };
                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[row.original.status]
                            }`}
                        >
                            {row.original.status}
                        </span>
                    );
                },
            },
            {
                header: "Actions",
                accessorKey: "_id",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedPayment(row.original);
                                setShowPaymentModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View & Verify"
                        >
                            <FiEye />
                        </button>
                        {row.original.status === "PENDING" && (
                            <>
                                <button
                                    onClick={() => {
                                        setSelectedPayment(row.original);
                                        setVerificationRemarks("");
                                        handleVerifyPayment("APPROVED");
                                    }}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    title="Quick Approve"
                                >
                                    <FiCheck />
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPayment(row.original);
                                        setShowPaymentModal(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Reject"
                                >
                                    <FiX />
                                </button>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            <Heading title="Fees Management" />

            {/* Tabs */}
            <div className="flex gap-2 my-8">
                <button
                    onClick={() => setActiveTab("fees")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "fees"
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Fee Structures
                </button>
                <button
                    onClick={() => setActiveTab("verify")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "verify"
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    Verify Payments
                    {payments.filter((p) => p.status === "PENDING").length >
                        0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            {
                                payments.filter((p) => p.status === "PENDING")
                                    .length
                            }
                        </span>
                    )}
                </button>
            </div>

            {/* Action Bar */}
            {activeTab === "fees" && (
                <div className="flex justify-end mb-6">
                    <CustomButton onClick={() => setShowCreateModal(true)}>
                        <FiPlus className="mr-2" />
                        Create Fee
                    </CustomButton>
                </div>
            )}

            {/* Data Table */}
            {loading ? (
                <Loading />
            ) : activeTab === "fees" ? (
                fees.length > 0 ? (
                    <DataTable data={fees} columns={feeColumns} pageSize={10} />
                ) : (
                    <NoData title="No fee structures found" />
                )
            ) : payments.length > 0 ? (
                <DataTable
                    data={payments}
                    columns={paymentColumns}
                    pageSize={10}
                />
            ) : (
                <NoData title="No payments to verify" />
            )}

            {/* Create Fee Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Create Fee Structure
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateFee}
                            className="p-6 space-y-6"
                        >
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiFileText className="mr-2" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amount & Dates */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiDollarSign className="mr-2" />
                                    Amount & Dates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Amount (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Last Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="lastDate"
                                            value={formData.lastDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Late Fee (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="lateFee"
                                            value={formData.lateFee}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Target Selection */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <FiUsers className="mr-2" />
                                    Target Audience
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Target Type *
                                        </label>
                                        <select
                                            name="targetType"
                                            value={formData.targetType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            {targetTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.targetType === "BRANCH" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Select Branches
                                            </label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {branches.map((branch) => (
                                                    <label
                                                        key={branch._id}
                                                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targets.branches.includes(
                                                                branch._id,
                                                            )}
                                                            onChange={(e) => {
                                                                const newBranches =
                                                                    e.target
                                                                        .checked
                                                                        ? [
                                                                              ...formData
                                                                                  .targets
                                                                                  .branches,
                                                                              branch._id,
                                                                          ]
                                                                        : formData.targets.branches.filter(
                                                                              (
                                                                                  id,
                                                                              ) =>
                                                                                  id !==
                                                                                  branch._id,
                                                                          );
                                                                handleTargetChange(
                                                                    "branches",
                                                                    newBranches,
                                                                );
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            {branch.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {formData.targetType === "SEMESTER" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Select Semesters
                                            </label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {semesters.map((sem) => (
                                                    <label
                                                        key={sem}
                                                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targets.semesters.includes(
                                                                sem,
                                                            )}
                                                            onChange={(e) => {
                                                                const newSemesters =
                                                                    e.target
                                                                        .checked
                                                                        ? [
                                                                              ...formData
                                                                                  .targets
                                                                                  .semesters,
                                                                              sem,
                                                                          ]
                                                                        : formData.targets.semesters.filter(
                                                                              (
                                                                                  s,
                                                                              ) =>
                                                                                  s !==
                                                                                  sem,
                                                                          );
                                                                handleTargetChange(
                                                                    "semesters",
                                                                    newSemesters,
                                                                );
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            Sem {sem}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {formData.targetType === "INDIVIDUAL" && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Search Students
                                            </label>
                                            <div className="relative">
                                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search by name..."
                                                    onChange={(e) =>
                                                        searchStudents(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>

                                            {/* Search Results */}
                                            {students.length > 0 && (
                                                <div className="mt-2 border rounded-lg max-h-40 overflow-y-auto">
                                                    {students.map((student) => (
                                                        <button
                                                            key={student._id}
                                                            type="button"
                                                            onClick={() =>
                                                                addStudent(
                                                                    student,
                                                                )
                                                            }
                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-0"
                                                        >
                                                            <div className="font-medium">
                                                                {
                                                                    student.firstName
                                                                }{" "}
                                                                {
                                                                    student.lastName
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    student.enrollmentNo
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    student
                                                                        .branch
                                                                        ?.name
                                                                }
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Selected Students */}
                                            {formData.targets.students.length >
                                                0 && (
                                                <div className="mt-3">
                                                    <label className="block text-sm font-medium mb-2">
                                                        Selected Students
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.targets.students.map(
                                                            (student) => (
                                                                <span
                                                                    key={
                                                                        student._id
                                                                    }
                                                                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                                                >
                                                                    {
                                                                        student.firstName
                                                                    }{" "}
                                                                    {
                                                                        student.lastName
                                                                    }
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeStudent(
                                                                                student._id,
                                                                            )
                                                                        }
                                                                        className="ml-2 text-green-600 hover:text-green-800"
                                                                    >
                                                                        <FiX
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <CustomButton
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Fee"}
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Payment Verification Modal */}
            {showPaymentModal && selectedPayment && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Verify Payment
                            </h2>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedPayment(null);
                                    setVerificationRemarks("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Payment Details */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Student:
                                    </span>
                                    <span className="font-medium">
                                        {selectedPayment.student?.firstName}{" "}
                                        {selectedPayment.student?.lastName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Enrollment:
                                    </span>
                                    <span className="font-medium">
                                        {selectedPayment.student?.enrollmentNo}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Fee Title:
                                    </span>
                                    <span className="font-medium">
                                        {selectedPayment.feeStructure?.title}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Expected Amount:
                                    </span>
                                    <span className="font-medium">
                                        ₹{selectedPayment.expectedAmount}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Paid Amount:
                                    </span>
                                    <span className="font-medium text-green-600">
                                        ₹{selectedPayment.amountPaid}
                                    </span>
                                </div>
                            </div>

                            {/* Receipt */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Receipt
                                </label>
                                <a
                                    href={selectedPayment.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                >
                                    <FiEye className="mr-2" />
                                    View Receipt
                                </a>
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Remarks (optional)
                                </label>
                                <textarea
                                    value={verificationRemarks}
                                    onChange={(e) =>
                                        setVerificationRemarks(e.target.value)
                                    }
                                    placeholder="Add any remarks..."
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <CustomButton
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedPayment(null);
                                        setVerificationRemarks("");
                                    }}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                    variant="danger"
                                    className="flex-1"
                                    onClick={() =>
                                        handleVerifyPayment("REJECTED")
                                    }
                                    disabled={verificationLoading}
                                >
                                    {verificationLoading
                                        ? "Processing..."
                                        : "Reject"}
                                </CustomButton>
                                <CustomButton
                                    className="flex-1"
                                    onClick={() =>
                                        handleVerifyPayment("APPROVED")
                                    }
                                    disabled={verificationLoading}
                                >
                                    {verificationLoading
                                        ? "Processing..."
                                        : "Approve"}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFees;
