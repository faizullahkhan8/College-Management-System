const Attendance = require("../models/attendance.model");
const Student = require("../models/details/student-details.model");
const ApiResponse = require("../utils/ApiResponse");

const markAttendanceController = async (req, res) => {
    try {
        const { date, semester, branchId, subjectId, attendanceList } = req.body;
        const markedBy = req.userId;

        if (!date || !semester || !branchId || !attendanceList || !Array.isArray(attendanceList)) {
            return ApiResponse.badRequest("Missing required fields: date, semester, branchId, attendanceList").send(res);
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const bulkOps = attendanceList.map((item) => ({
            updateOne: {
                filter: {
                    studentId: item.studentId,
                    date: attendanceDate,
                    subjectId: subjectId || null,
                },
                update: {
                    $set: {
                        status: item.status,
                        semester: Number(semester),
                        branchId,
                        subjectId: subjectId || null,
                        markedBy,
                        remark: item.remark || "",
                    },
                },
                upsert: true,
            },
        }));

        await Attendance.bulkWrite(bulkOps);

        return ApiResponse.success(null, "Attendance marked successfully").send(res);
    } catch (error) {
        console.error("Mark Attendance Error:", error);
        return ApiResponse.internalServerError().send(res);
    }
};

const getAttendanceByDateController = async (req, res) => {
    try {
        const { date, semester, branchId, subjectId } = req.query;

        if (!date || !semester || !branchId) {
            return ApiResponse.badRequest("Date, semester and branchId are required").send(res);
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const query = {
            date: attendanceDate,
            semester: Number(semester),
            branchId,
        };

        if (subjectId) {
            query.subjectId = subjectId;
        }

        const attendance = await Attendance.find(query)
            .populate("studentId", "firstName middleName lastName enrollmentNo profile")
            .populate("branchId", "name")
            .populate("subjectId", "name")
            .populate("markedBy", "firstName lastName");

        return ApiResponse.success(attendance, "Attendance retrieved successfully").send(res);
    } catch (error) {
        console.error("Get Attendance Error:", error);
        return ApiResponse.internalServerError().send(res);
    }
};

const getStudentsForAttendanceController = async (req, res) => {
    try {
        const { semester, branchId, date, subjectId } = req.query;

        if (!semester || !branchId || !date) {
            return ApiResponse.badRequest("Semester, branchId and date are required").send(res);
        }

        const students = await Student.find({
            semester: Number(semester),
            branchId,
        })
            .select("_id firstName middleName lastName enrollmentNo profile")
            .sort({ enrollmentNo: 1 });

        if (!students || students.length === 0) {
            return ApiResponse.notFound("No students found for the selected class").send(res);
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const query = {
            date: attendanceDate,
            semester: Number(semester),
            branchId,
            studentId: { $in: students.map((s) => s._id) },
        };

        if (subjectId) {
            query.subjectId = subjectId;
        }

        const existingAttendance = await Attendance.find(query);

        const attendanceMap = {};
        existingAttendance.forEach((a) => {
            attendanceMap[a.studentId.toString()] = a.status;
        });

        const studentsWithAttendance = students.map((student) => ({
            ...student.toObject(),
            status: attendanceMap[student._id.toString()] || "present",
        }));

        return ApiResponse.success(studentsWithAttendance, "Students retrieved successfully").send(res);
    } catch (error) {
        console.error("Get Students for Attendance Error:", error);
        return ApiResponse.internalServerError().send(res);
    }
};

const getAttendanceReportController = async (req, res) => {
    try {
        const { studentId, semester, fromDate, toDate } = req.query;

        if (!studentId || !semester) {
            return ApiResponse.badRequest("studentId and semester are required").send(res);
        }

        const query = {
            studentId,
            semester: Number(semester),
        };

        if (fromDate && toDate) {
            query.date = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            };
        }

        const attendance = await Attendance.find(query)
            .populate("studentId", "firstName lastName enrollmentNo")
            .populate("branchId", "name")
            .sort({ date: -1 });

        const total = attendance.length;
        const present = attendance.filter((a) => a.status === "present").length;
        const absent = attendance.filter((a) => a.status === "absent").length;
        const late = attendance.filter((a) => a.status === "late").length;

        const report = {
            total,
            present,
            absent,
            late,
            presentPercent: total > 0 ? ((present / total) * 100).toFixed(2) : 0,
            absentPercent: total > 0 ? ((absent / total) * 100).toFixed(2) : 0,
            latePercent: total > 0 ? ((late / total) * 100).toFixed(2) : 0,
            records: attendance,
        };

        return ApiResponse.success(report, "Attendance report retrieved successfully").send(res);
    } catch (error) {
        console.error("Get Attendance Report Error:", error);
        return ApiResponse.internalServerError().send(res);
    }
};

const deleteAttendanceController = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Attendance.findByIdAndDelete(id);

        if (!deleted) {
            return ApiResponse.notFound("Attendance record not found").send(res);
        }

        return ApiResponse.success(null, "Attendance record deleted successfully").send(res);
    } catch (error) {
        console.error("Delete Attendance Error:", error);
        return ApiResponse.internalServerError().send(res);
    }
};

module.exports = {
    markAttendanceController,
    getAttendanceByDateController,
    getStudentsForAttendanceController,
    getAttendanceReportController,
    deleteAttendanceController,
};
