const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const auth = require("../middlewares/auth.middleware");
const {
    createFeeStructure,
    getAllFeeStructures,
    getStudentFees,
    submitPayment,
    getAllPayments,
    verifyPayment,
    deleteFeeStructure,
    toggleFeeStatus,
} = require("../controllers/fees.controller");

// Admin routes
router.post("/", auth, createFeeStructure);
router.get("/", auth, getAllFeeStructures);
router.get("/payments", auth, getAllPayments);
router.patch("/verify/:paymentId", auth, verifyPayment);
router.delete("/:feeId", auth, deleteFeeStructure);
router.patch("/:feeId/toggle", auth, toggleFeeStatus);

// Student routes
router.get("/student", auth, getStudentFees);
router.post("/pay", auth, upload.single("receipt"), submitPayment);

module.exports = router;
