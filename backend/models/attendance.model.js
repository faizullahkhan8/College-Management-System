const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentDetail",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["present", "absent", "late"],
            default: "present",
            required: true,
        },
        semester: {
            type: Number,
            required: true,
        },
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            default: null,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FacultyDetail",
            required: true,
        },
        remark: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

attendanceSchema.index({ studentId: 1, date: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
