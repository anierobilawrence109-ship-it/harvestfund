const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWallet,
  fundWallet,
  requestFunding,
} = require("../controllers/walletController");

// Get wallet balance
router.get("/", authMiddleware, getWallet);

// Old direct funding route (keep for now)
router.post("/fund", authMiddleware, fundWallet);

// New manual funding request route
router.post(
  "/request-funding",
  authMiddleware,
  requestFunding
);

module.exports = router;