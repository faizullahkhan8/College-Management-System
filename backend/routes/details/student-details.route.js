const express = require("express");
const router = express.Router();
const {
  loginStudentController,
  getAllDetailsController,
  registerStudentController,
  updateDetailsController,
  deleteDetailsController,
  getMyDetailsController,
  sendForgetPasswordEmail,
  updatePasswordHandler,
  searchStudentsController,
  updateLoggedInPasswordController,
  getStudentByIdController,
} = require("../../controllers/details/student-details.controller");
const upload = require("../../middlewares/multer.middleware");
const auth = require("../../middlewares/auth.middleware");

router.post("/register", upload.single("file"), registerStudentController);
router.post("/login", loginStudentController);
router.get("/my-details", auth, getMyDetailsController);

router.get("/", auth, getAllDetailsController);
router.get("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, getStudentByIdController);
router.patch("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, upload.single("file"), updateDetailsController);
router.delete("/:id([0-9a-fA-F]{24})([0-9a-fA-F]{24})", auth, deleteDetailsController);
router.post("/forget-password", sendForgetPasswordEmail);
router.post("/update-password/:resetId", updatePasswordHandler);
router.post("/change-password", auth, updateLoggedInPasswordController);
router.post("/search", auth, searchStudentsController);

module.exports = router;
