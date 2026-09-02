const express = require("express");
const {
  getMarksController,
  addMarksController,
  deleteMarksController,
  addBulkMarksController,
  getStudentsWithMarksController,
  getStudentMarksController,
} = require("../controllers/marks.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

router.get("/", auth, getMarksController);
router.get("/students", auth, getStudentsWithMarksController);
router.get("/student", auth, getStudentMarksController);
router.post("/", auth, addMarksController);
router.post("/bulk", auth, addBulkMarksController);
router.delete("/:id([0-9a-fA-F]{24})", auth, deleteMarksController);

module.exports = router;
