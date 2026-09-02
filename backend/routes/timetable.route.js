require("dotenv").config();
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const auth = require("../middlewares/auth.middleware");
const {
  getTimetableController,
  addTimetableController,
  updateTimetableController,
  deleteTimetableController,
} = require("../controllers/timetable.controller");

router.get("/", auth, getTimetableController);

router.post("/", auth, upload.single("file"), addTimetableController);

router.put("/:id([0-9a-fA-F]{24})", auth, upload.single("file"), updateTimetableController);

router.delete("/:id([0-9a-fA-F]{24})", auth, deleteTimetableController);

module.exports = router;
