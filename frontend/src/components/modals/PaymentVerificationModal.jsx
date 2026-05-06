import React from "react";
import { FiX, FiEye } from "react-icons/fi";
import CustomButton from "../CustomButton";

const PaymentVerificationModal = ({
    show,
    onClose,
    selectedPayment,
    verificationRemarks,
    onRemarksChange,
    onVerify,
    verificationLoading,
}) => {
    if (!show || !selectedPayment) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        Verify Payment
                    </h2>
                    <button
                        onClick={onClose}
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
                                Amount Paid:
                            </span>
                            <span className="font-semibold text-green-600">
                                ₹{selectedPayment.amountPaid}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Expected Amount:
                            </span>
                            <span className="font-semibold">
                                ₹{selectedPayment.expectedAmount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Submitted:
                            </span>
                            <span className="font-medium">
                                {new Date(
                                    selectedPayment.submittedAt,
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Receipt Preview */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Receipt
                        </label>
                        <a
                            href={selectedPayment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                            onChange={onRemarksChange}
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
                            {verificationLoading
                                ? "Processing..."
                                : "Reject"}
                        </CustomButton>
                        <CustomButton
                            className="flex-1"
                            onClick={() => onVerify("APPROVED")}
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
    );
};

export default PaymentVerificationModal;
