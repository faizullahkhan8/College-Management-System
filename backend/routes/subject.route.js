const express = require("express");
const {
  getSubjectController,
  addSubjectController,
  deleteSubjectController,
  updateSubjectController,
  searchSubjectController,
} = require("../controllers/subject.controller");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
router.get("/", auth, getSubjectController);
router.post("/search", auth, searchSubjectController);
router.post("/", auth, addSubjectController);
router.delete("/:id([0-9a-fA-F]{24})", auth, deleteSubjectController);
router.put("/:id([0-9a-fA-F]{24})", auth, updateSubjectController);

module.exports = router;
