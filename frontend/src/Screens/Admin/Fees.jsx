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
import CreateFeeModal from "../../components/modals/CreateFeeModal";
import PaymentVerificationModal from "../../components/modals/PaymentVerificationModal";
import FeeDetailsModal from "../../components/modals/FeeDetailsModal";
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

    // Fee details modal state
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [feeDetails, setFeeDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsFilter, setDetailsFilter] = useState("all"); // all, paid, pending, rejected, unpaid

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

    const handleViewDetails = async (feeId) => {
        setDetailsLoading(true);
        setShowDetailsModal(true);
        try {
            const response = await axiosWrapper.get(`/fees/${feeId}/details`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            if (response.data.success) {
                setFeeDetails(response.data.data);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load fee details",
            );
            setShowDetailsModal(false);
        } finally {
            setDetailsLoading(false);
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
                            onClick={() => handleViewDetails(row.original._id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="View Details"
                        >
                            <FiEye />
                        </button>
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
            <div className="flex justify-between my-8">
                <div className="flex gap-2">
                    <CustomButton onClick={() => setActiveTab("fees")}>
                        Fee Structures
                    </CustomButton>
                    <CustomButton onClick={() => setActiveTab("verify")}>
                        Verify Payments
                        {payments.filter((p) => p.status === "PENDING").length >
                            0 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {
                                    payments.filter(
                                        (p) => p.status === "PENDING",
                                    ).length
                                }
                            </span>
                        )}
                    </CustomButton>
                </div>
                {/* Action Bar */}
                {activeTab === "fees" && (
                    <CustomButton onClick={() => setShowCreateModal(true)}>
                        <FiPlus className="mr-2" />
                        Create Fee
                    </CustomButton>
                )}
            </div>

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

            <CreateFeeModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                formData={formData}
                onInputChange={handleInputChange}
                onTargetChange={handleTargetChange}
                onSubmit={handleCreateFee}
                loading={loading}
                branches={branches}
                targetTypes={targetTypes}
                semesters={semesters}
                students={students}
                searchStudents={searchStudents}
                addStudent={addStudent}
                removeStudent={removeStudent}
            />

            <PaymentVerificationModal
                show={showPaymentModal}
                onClose={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                    setVerificationRemarks("");
                }}
                selectedPayment={selectedPayment}
                verificationRemarks={verificationRemarks}
                onRemarksChange={(e) => setVerificationRemarks(e.target.value)}
                onVerify={handleVerifyPayment}
                verificationLoading={verificationLoading}
            />

            <FeeDetailsModal
                show={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setFeeDetails(null);
                    setDetailsFilter("all");
                }}
                feeDetails={feeDetails}
                detailsLoading={detailsLoading}
                detailsFilter={detailsFilter}
                onFilterChange={setDetailsFilter}
                formatDate={formatDate}
            />
        </div>
    );
};

export default AdminFees;
