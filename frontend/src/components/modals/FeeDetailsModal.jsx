import React from "react";
import {
    FiX,
    FiFileText,
    FiDollarSign,
    FiUsers,
    FiCheck,
    FiCalendar,
    FiEye,
} from "react-icons/fi";
import Loading from "../Loading";

const FeeDetailsModal = ({
    show,
    onClose,
    feeDetails,
    detailsLoading,
    detailsFilter,
    onFilterChange,
    formatDate,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-300 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Fee Structure Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <FiX />
                    </button>
                </div>

                {detailsLoading ? (
                    <div className="p-12">
                        <Loading />
                    </div>
                ) : feeDetails ? (
                    <div className="p-6 space-y-6">
                        {/* Fee Structure Info */}
                        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FiFileText className="mr-2" />
                                {feeDetails.feeStructure.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Amount
                                    </span>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₹{feeDetails.feeStructure.amount}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Last Date
                                    </span>
                                    <p className="text-lg font-semibold">
                                        {formatDate(
                                            feeDetails.feeStructure.lastDate,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Target Type
                                    </span>
                                    <p className="text-lg font-semibold">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {feeDetails.feeStructure.targetType}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {feeDetails.feeStructure.description && (
                                <p className="mt-4 text-gray-700">
                                    {feeDetails.feeStructure.description}
                                </p>
                            )}
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white border-gray-300 border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Total Targeted
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {
                                                feeDetails.statistics
                                                    .totalTargeted
                                            }
                                        </p>
                                    </div>
                                    <FiUsers className="text-2xl text-gray-400" />
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Paid
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {feeDetails.statistics.paidStudents}
                                        </p>
                                    </div>
                                    <FiCheck className="text-2xl text-green-500" />
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Pending
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {
                                                feeDetails.statistics
                                                    .pendingStudents
                                            }
                                        </p>
                                    </div>
                                    <FiCalendar className="text-2xl text-yellow-500" />
                                </div>
                            </div>
                            <div className="bg-gray-50 border-gray-300 border rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Unpaid
                                        </p>
                                        <p className="text-2xl font-bold text-gray-600">
                                            {
                                                feeDetails.statistics
                                                    .unpaidStudents
                                            }
                                        </p>
                                    </div>
                                    <FiX className="text-2xl text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Revenue Overview */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FiDollarSign className="mr-2" />
                                Revenue Overview
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Expected Revenue
                                    </span>
                                    <p className="text-xl font-bold text-gray-700">
                                        ₹
                                        {feeDetails.revenue.expectedRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Collected Revenue
                                    </span>
                                    <p className="text-xl font-bold text-green-600">
                                        ₹
                                        {feeDetails.revenue.totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">
                                        Collection Rate
                                    </span>
                                    <p className="text-xl font-bold text-blue-600">
                                        {feeDetails.revenue.collectionRate}%
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${feeDetails.revenue.collectionRate}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {feeDetails.revenue.collectionRate}% of
                                    expected revenue collected
                                </p>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 border-b border-gray-300">
                            {[
                                "all",
                                "paid",
                                "pending",
                                "rejected",
                                "unpaid",
                            ].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => onFilterChange(filter)}
                                    className={`px-4 py-2 font-medium transition-colors ${
                                        detailsFilter === filter
                                            ? "border-b-2 border-purple-500 text-purple-600"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    {filter.charAt(0).toUpperCase() +
                                        filter.slice(1)}
                                    {filter !== "all" && (
                                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                            {filter === "paid"
                                                ? feeDetails.statistics
                                                      .paidStudents
                                                : filter === "pending"
                                                  ? feeDetails.statistics
                                                        .pendingStudents
                                                  : filter === "rejected"
                                                    ? feeDetails.statistics
                                                          .rejectedStudents
                                                    : feeDetails.statistics
                                                          .unpaidStudents}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Students List */}
                        <div className="bg-white border-gray-300 border rounded-lg">
                            <div className="max-h-96 overflow-y-auto">
                                {feeDetails.students
                                    .filter(
                                        (student) =>
                                            detailsFilter === "all" ||
                                            student.paymentStatus ===
                                                detailsFilter.toUpperCase(),
                                    )
                                    .map((student) => (
                                        <div
                                            key={student.studentId}
                                            className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {student.studentInfo
                                                            ? `${student.studentInfo.firstName} ${student.studentInfo.lastName}`
                                                            : "Student details not available"}
                                                    </div>
                                                    {student.studentInfo && (
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                student
                                                                    .studentInfo
                                                                    .enrollmentNo
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                student.paymentStatus ===
                                                                "PAID"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : student.paymentStatus ===
                                                                        "PENDING"
                                                                      ? "bg-yellow-100 text-yellow-800"
                                                                      : student.paymentStatus ===
                                                                          "REJECTED"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {
                                                                student.paymentStatus
                                                            }
                                                        </div>
                                                        {student.paymentStatus !==
                                                            "UNPAID" && (
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                ₹
                                                                {
                                                                    student.amountPaid
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    {student.receiptUrl && (
                                                        <a
                                                            href={
                                                                student.receiptUrl
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            <FiEye className="inline mr-1" />
                                                            Receipt
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Recent Payments */}
                        {feeDetails.recentPayments.length > 0 && (
                            <div className="bg-white border border-gray-300 rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Recent Payments
                                </h3>
                                <div className="space-y-3">
                                    {feeDetails.recentPayments.map(
                                        (payment) => (
                                            <div
                                                key={payment._id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {
                                                            payment.student
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            payment.student
                                                                .lastName
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {
                                                            payment.student
                                                                .enrollmentNo
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            payment.status ===
                                                            "APPROVED"
                                                                ? "bg-green-100 text-green-800"
                                                                : payment.status ===
                                                                    "PENDING"
                                                                  ? "bg-yellow-100 text-yellow-800"
                                                                  : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {payment.status}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        ₹{payment.amountPaid}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FeeDetailsModal;
