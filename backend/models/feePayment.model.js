const mongoose = require("mongoose");

const feePaymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentDetail",
            required: [true, "Student is required"],
        },
        feeStructure: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FeeStructure",
            required: [true, "Fee structure is required"],
        },
        amountPaid: {
            type: Number,
            required: [true, "Amount paid is required"],
            min: [0, "Amount cannot be negative"],
        },
        receiptUrl: {
            type: String,
            required: [true, "Receipt is required"],
        },
        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING",
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminDetail",
        },
        verifiedAt: {
            type: Date,
        },
        remarks: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true },
);

// Index for efficient querying
feePaymentSchema.index({ student: 1, status: 1 });
feePaymentSchema.index({ feeStructure: 1, student: 1 }, { unique: true }); // Prevent duplicate payments
feePaymentSchema.index({ status: 1, submittedAt: -1 });

const feePaymentModel = mongoose.model("FeePayment", feePaymentSchema);

module.exports = feePaymentModel;
