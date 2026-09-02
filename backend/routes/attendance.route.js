const express = require("express");
const router = express.Router();
const {
    markAttendanceController,
    getAttendanceByDateController,
    getStudentsForAttendanceController,
    getAttendanceReportController,
    deleteAttendanceController,
} = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/mark", auth, markAttendanceController);
router.get("/by-date", auth, getAttendanceByDateController);
router.get("/students", auth, getStudentsForAttendanceController);
router.get("/report", auth, getAttendanceReportController);
router.delete("/:id([0-9a-fA-F]{24})", auth, deleteAttendanceController);

module.exports = router;
