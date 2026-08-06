const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
  getFundingRequests,
  approveFundingRequest,
  rejectFundingRequest,
} = require("../controllers/adminController");

const {
  getAllWithdrawals,
  updateWithdrawalStatus,
} = require("../controllers/withdrawalController");

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);

// ==========================================
// ADMIN USERS
// ==========================================
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// ==========================================
// FUNDING REQUESTS
// ==========================================
router.get(
  "/funding-requests",
  authMiddleware,
  adminMiddleware,
  getFundingRequests
);

router.patch(
  "/funding-requests/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveFundingRequest
);

router.patch(
  "/funding-requests/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectFundingRequest
);

// ==========================================
// WITHDRAWALS
// ==========================================
router.get(
  "/withdrawals",
  authMiddleware,
  adminMiddleware,
  getAllWithdrawals
);

router.patch(
  "/withdrawals/:id/status",
  authMiddleware,
  adminMiddleware,
  updateWithdrawalStatus
);

module.exports = router;