const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAdminStats,
  getAllUsers,
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
// ADMIN: GET ALL REGISTERED USERS
// ==========================================
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// ==========================================
// ADMIN: GET ALL WITHDRAWALS
// ==========================================
router.get(
  "/withdrawals",
  authMiddleware,
  adminMiddleware,
  getAllWithdrawals
);

// ==========================================
// ADMIN: APPROVE OR REJECT WITHDRAWAL
// ==========================================
router.patch(
  "/withdrawals/:id/status",
  authMiddleware,
  adminMiddleware,
  updateWithdrawalStatus
);

module.exports = router;