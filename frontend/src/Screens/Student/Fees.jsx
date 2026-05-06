import React, { useEffect, useState } from "react";
import {
    FiDollarSign,
    FiCalendar,
    FiUpload,
    FiEye,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiAlertTriangle,
    FiX,
    FiFileText,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import NoData from "../../components/NoData";
import axiosWrapper from "../../utils/AxiosWrapper";

const StudentFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [amountPaid, setAmountPaid] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState("ALL"); // ALL, PENDING, PAID, OVERDUE
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const response = await axiosWrapper.get("/fees/student", {
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and PDF files are allowed");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setReceiptFile(file);

        // Create preview for images
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setReceiptPreview(null);
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();

        if (!receiptFile) {
            toast.error("Please upload a receipt");
            return;
        }

        if (!amountPaid || Number(amountPaid) < selectedFee.totalAmount) {
            toast.error(
                `Minimum amount required is ₹${selectedFee.totalAmount}`,
            );
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("receipt", receiptFile);
            formData.append("feeStructureId", selectedFee._id);
            formData.append("amountPaid", amountPaid);

            const response = await axiosWrapper.post("/fees/pay", formData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success(
                    "Payment submitted successfully! Awaiting verification.",
                );
                setShowPaymentModal(false);
                setSelectedFee(null);
                setReceiptFile(null);
                setReceiptPreview(null);
                setAmountPaid("");
                fetchFees();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to submit payment",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isOverdue = (lastDate) => {
        return new Date() > new Date(lastDate);
    };

    const getDaysRemaining = (lastDate) => {
        const today = new Date();
        const due = new Date(lastDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusBadge = (fee) => {
        if (fee.paymentStatus === "APPROVED") {
            return (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <FiCheckCircle className="mr-1" />
                    Paid
                </span>
            );
        }
        if (fee.paymentStatus === "PENDING") {
            return (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    <FiClock className="mr-1" />
                    Pending Verification
                </span>
            );
        }
        if (fee.paymentStatus === "REJECTED") {
            return (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <FiXCircle className="mr-1" />
                    Rejected
                </span>
            );
        }
        if (fee.isLate) {
            return (
                <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    <FiAlertTriangle className="mr-1" />
                    Overdue +₹{fee.lateFeeAmount}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <FiClock className="mr-1" />
                {getDaysRemaining(fee.lastDate)} days left
            </span>
        );
    };

    const filteredFees = fees.filter((fee) => {
        if (filter === "ALL") return true;
        if (filter === "PENDING") return !fee.paymentStatus;
        if (filter === "PAID") return fee.paymentStatus === "APPROVED";
        if (filter === "OVERDUE") return fee.isLate && !fee.paymentStatus;
        return true;
    });

    const stats = {
        total: fees.length,
        pending: fees.filter((f) => !f.paymentStatus).length,
        paid: fees.filter((f) => f.paymentStatus === "APPROVED").length,
        overdue: fees.filter((f) => f.isLate && !f.paymentStatus).length,
    };

    return (
        <div className="w-full mx-auto flex flex-col mb-10">
            <Heading title="My Fees" />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Total Fees</div>
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.total}
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-100">
                    <div className="text-sm text-yellow-600">Pending</div>
                    <div className="text-2xl font-bold text-yellow-700">
                        {stats.pending}
                    </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-100">
                    <div className="text-sm text-green-600">Paid</div>
                    <div className="text-2xl font-bold text-green-700">
                        {stats.paid}
                    </div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
                    <div className="text-sm text-red-600">Overdue</div>
                    <div className="text-2xl font-bold text-red-700">
                        {stats.overdue}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {[
                    { key: "ALL", label: "All Fees" },
                    { key: "PENDING", label: "Pending" },
                    { key: "PAID", label: "Paid" },
                    { key: "OVERDUE", label: "Overdue" },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            filter === f.key
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Fees List */}
            {loading ? (
                <Loading />
            ) : filteredFees.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFees.map((fee) => (
                        <div
                            key={fee._id}
                            className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                                fee.isLate && !fee.paymentStatus
                                    ? "border-red-200"
                                    : fee.paymentStatus === "APPROVED"
                                      ? "border-green-200"
                                      : fee.paymentStatus === "PENDING"
                                        ? "border-yellow-200"
                                        : "border-gray-100"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {fee.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {fee.description}
                                    </p>
                                </div>
                                {getStatusBadge(fee)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center text-gray-600">
                                    <FiDollarSign className="mr-2" />
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Amount
                                        </div>
                                        <div className="font-semibold">
                                            ₹{fee.amount}
                                            {fee.isLate && (
                                                <span className="text-red-500 text-sm ml-1">
                                                    + ₹{fee.lateFeeAmount} late
                                                    fee
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <FiCalendar className="mr-2" />
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Due Date
                                        </div>
                                        <div
                                            className={`font-semibold ${
                                                fee.isLate ? "text-red-600" : ""
                                            }`}
                                        >
                                            {formatDate(fee.lastDate)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Total Amount Due
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{fee.totalAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {!fee.paymentStatus && (
                                    <CustomButton
                                        onClick={() => {
                                            setSelectedFee(fee);
                                            setAmountPaid(
                                                fee.totalAmount.toString(),
                                            );
                                            setShowPaymentModal(true);
                                        }}
                                        className="flex-1"
                                    >
                                        <FiUpload className="mr-2" />
                                        Pay Now
                                    </CustomButton>
                                )}
                                {fee.paymentStatus === "PENDING" && (
                                    <CustomButton
                                        variant="secondary"
                                        className="flex-1"
                                        disabled
                                    >
                                        <FiClock className="mr-2" />
                                        Awaiting Verification
                                    </CustomButton>
                                )}
                                {fee.paymentStatus === "APPROVED" && (
                                    <>
                                        <CustomButton
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() =>
                                                window.open(
                                                    fee.receiptUrl,
                                                    "_blank",
                                                )
                                            }
                                        >
                                            <FiEye className="mr-2" />
                                            View Receipt
                                        </CustomButton>
                                        <div className="flex-1 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
                                            <FiCheckCircle className="mr-2" />
                                            Verified on{" "}
                                            {formatDate(fee.verifiedAt)}
                                        </div>
                                    </>
                                )}
                                {fee.paymentStatus === "REJECTED" && (
                                    <CustomButton
                                        onClick={() => {
                                            setSelectedFee(fee);
                                            setAmountPaid(
                                                fee.totalAmount.toString(),
                                            );
                                            setShowPaymentModal(true);
                                        }}
                                        variant="danger"
                                        className="flex-1"
                                    >
                                        Re-submit Payment
                                    </CustomButton>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <NoData title="No fees found" />
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedFee && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">
                                Submit Payment
                            </h2>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedFee(null);
                                    setReceiptFile(null);
                                    setReceiptPreview(null);
                                    setAmountPaid("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiX />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitPayment}
                            className="p-6 space-y-6"
                        >
                            {/* Fee Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {selectedFee.title}
                                </h3>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Base Amount:
                                    </span>
                                    <span>₹{selectedFee.amount}</span>
                                </div>
                                {selectedFee.isLate && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Late Fee:</span>
                                        <span>
                                            ₹{selectedFee.lateFeeAmount}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                                    <span>Total Due:</span>
                                    <span className="text-green-600">
                                        ₹{selectedFee.totalAmount}
                                    </span>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Amount Paid *
                                </label>
                                <input
                                    type="number"
                                    value={amountPaid}
                                    onChange={(e) =>
                                        setAmountPaid(e.target.value)
                                    }
                                    min={selectedFee.totalAmount}
                                    className="w-full px-4 py-2 border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter amount"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Minimum ₹{selectedFee.totalAmount} required
                                </p>
                            </div>

                            {/* Receipt Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Upload Receipt *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="receipt-upload"
                                    />
                                    <label
                                        htmlFor="receipt-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        {receiptPreview ? (
                                            <img
                                                src={receiptPreview}
                                                alt="Receipt preview"
                                                className="max-h-40 object-contain mb-2"
                                            />
                                        ) : receiptFile ? (
                                            <div className="flex items-center text-gray-600">
                                                <FiFileText
                                                    className="mr-2"
                                                    size={24}
                                                />
                                                <span>{receiptFile.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                                                <span className="text-gray-600">
                                                    Click to upload receipt
                                                </span>
                                                <span className="text-sm text-gray-400 mt-1">
                                                    JPG, PNG, or PDF (max 5MB)
                                                </span>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {receiptFile && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReceiptFile(null);
                                            setReceiptPreview(null);
                                        }}
                                        className="text-sm text-red-600 mt-2 hover:underline"
                                    >
                                        Remove file
                                    </button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <CustomButton
                                    type="button"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedFee(null);
                                        setReceiptFile(null);
                                        setReceiptPreview(null);
                                        setAmountPaid("");
                                    }}
                                >
                                    Cancel
                                </CustomButton>
                                <CustomButton
                                    type="submit"
                                    className="flex-1"
                                    disabled={submitting || !receiptFile}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Payment"}
                                </CustomButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentFees;
