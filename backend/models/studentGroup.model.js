const mongoose = require("mongoose");

const studentGroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Group name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "StudentDetail",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminDetail",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const studentGroupModel = mongoose.model("StudentGroup", studentGroupSchema);

module.exports = studentGroupModel;
