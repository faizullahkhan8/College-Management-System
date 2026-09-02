const express = require("express");
const {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
  getUpcomingExamsController,
} = require("../controllers/exam.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

router.get("/", auth, getAllExamsController);
router.get("/upcoming", auth, getUpcomingExamsController);
router.post("/", auth, upload.single("file"), addExamController);
router.patch("/:id([0-9a-fA-F]{24})", auth, upload.single("file"), updateExamController);
router.delete("/:id([0-9a-fA-F]{24})", auth, deleteExamController);

module.exports = router;
