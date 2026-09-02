const express = require("express");
const router = express.Router();
const {
  loginFacultyController,
  registerFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getAllFacultyController,
  getMyFacultyDetailsController,
  sendFacultyResetPasswordEmail,
  updateFacultyPasswordHandler,
  updateLoggedInPasswordController,
  searchFacultyController,
  getFacultyByIdController,
  getFacultySummaryController,
} = require("../../controllers/details/faculty-details.controller");
const upload = require("../../middlewares/multer.middleware");
const auth = require("../../middlewares/auth.middleware");

router.post("/register", upload.single("file"), registerFacultyController);
router.post("/login", loginFacultyController);
router.get("/my-details", auth, getMyFacultyDetailsController);

router.get("/", auth, getAllFacultyController);
router.get("/summary", auth, getFacultySummaryController);
router.get("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, getFacultyByIdController);
router.post("/search", auth, searchFacultyController);
router.patch("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, upload.single("file"), updateFacultyController);
router.delete("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, deleteFacultyController);
router.post("/forget-password", sendFacultyResetPasswordEmail);
router.post("/update-password/:resetId", updateFacultyPasswordHandler);
router.post("/change-password", auth, updateLoggedInPasswordController);

module.exports = router;
