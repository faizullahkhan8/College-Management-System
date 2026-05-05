const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Fee title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },
        lastDate: {
            type: Date,
            required: [true, "Last date is required"],
        },
        lateFee: {
            type: Number,
            default: 0,
            min: [0, "Late fee cannot be negative"],
        },
        targetType: {
            type: String,
            required: [true, "Target type is required"],
            enum: ["ALL", "BRANCH", "SEMESTER", "GROUP", "INDIVIDUAL"],
        },
        targets: {
            branches: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Branch",
                },
            ],
            semesters: [
                {
                    type: String,
                },
            ],
            students: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "StudentDetail",
                },
            ],
            groups: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "StudentGroup",
                },
            ],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminDetail",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Index for efficient querying
feeStructureSchema.index({ targetType: 1, isActive: 1 });
feeStructureSchema.index({ "targets.branches": 1 });
feeStructureSchema.index({ "targets.semesters": 1 });
feeStructureSchema.index({ "targets.students": 1 });

// Compound index to prevent duplicate fees for same target
const feeStructureModel = mongoose.model("FeeStructure", feeStructureSchema);

module.exports = feeStructureModel;
