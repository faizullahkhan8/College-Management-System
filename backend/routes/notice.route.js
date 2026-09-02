const express = require("express");
const {
  getNoticeController,
  addNoticeController,
  updateNoticeController,
  deleteNoticeController,
} = require("../controllers/notice.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", auth, getNoticeController);
router.post("/", auth, addNoticeController);
router.put("/:id([0-9a-fA-F]{24})", auth, updateNoticeController);
router.delete("/:id([0-9a-fA-F]{24})", auth, deleteNoticeController);

module.exports = router;
