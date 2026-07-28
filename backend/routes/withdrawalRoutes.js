const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createWithdrawal,
  getWithdrawals,
  getAllWithdrawals,
updateWithdrawalStatus,
} = require("../controllers/withdrawalController");

// Create withdrawal request
router.post(
  "/create",
  authMiddleware,
  createWithdrawal
);

// Get user's withdrawal history
router.get(
  "/",
  authMiddleware,
  getWithdrawals
);
// Admin: Get all withdrawal requests
router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAllWithdrawals
);
module.exports = router;

// Admin: Approve or Reject withdrawal
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateWithdrawalStatus
);