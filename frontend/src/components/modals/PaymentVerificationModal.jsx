import React from "react";
import { FiX, FiEye } from "react-icons/fi";
import CustomButton from "../CustomButton";
import { useTheme } from "../../contexts/ThemeContext";

const PaymentVerificationModal = ({
    show,
    onClose,
    selectedPayment,
    verificationRemarks,
    onRemarksChange,
    onVerify,
    verificationLoading,
}) => {
    const { isDark } = useTheme();
    if (!show || !selectedPayment) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/50 z-50 flex items-center justify-center p-4">
            <div
                className={`rounded-xl shadow-xl max-w-lg w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
                <div
                    className={`p-6 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-300"}`}
                >
                    <h2
                        className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                        Verify Payment
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                    >
                        <FiX
                            className={
                                isDark ? "text-gray-400" : "text-gray-600"
                            }
                        />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Payment Details */}
                    <div
                        className={`rounded-lg p-4 space-y-2 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
                    >
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Student:
                            </span>
                            <span
                                className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                                {selectedPayment.student?.firstName}{" "}
                                {selectedPayment.student?.lastName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Enrollment:
                            </span>
                            <span
                                className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                                {selectedPayment.student?.enrollmentNo}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Fee Title:
                            </span>
                            <span
                                className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                                {selectedPayment.feeStructure?.title}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Amount Paid:
                            </span>
                            <span
                                className={`font-semibold ${isDark ? "text-green-400" : "text-green-600"}`}
                            >
                                ₹{selectedPayment.amountPaid}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Expected Amount:
                            </span>
                            <span
                                className={`font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                                ₹{selectedPayment.expectedAmount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span
                                className={
                                    isDark ? "text-gray-300" : "text-gray-600"
                                }
                            >
                                Submitted:
                            </span>
                            <span
                                className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}
                            >
                                {new Date(
                                    selectedPayment.submittedAt,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Receipt Preview */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                            Receipt
                        </label>
                        <a
                            href={selectedPayment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
                        >
                            <FiEye className="mr-2" />
                            View Receipt
                        </a>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label
                            className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                            Remarks (optional)
                        </label>
                        <textarea
                            value={verificationRemarks}
                            onChange={onRemarksChange}
                            placeholder="Add any remarks..."
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${isDark ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <CustomButton
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton
                            variant="danger"
                            className="flex-1"
                            onClick={() => onVerify("REJECTED")}
                            disabled={verificationLoading}
                        >
                            {verificationLoading ? "Processing..." : "Reject"}
                        </CustomButton>
                        <CustomButton
                            className="flex-1"
                            onClick={() => onVerify("APPROVED")}
                            disabled={verificationLoading}
                        >
                            {verificationLoading ? "Processing..." : "Approve"}
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentVerificationModal;
