const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWallet,
  fundWallet,
} = require("../controllers/walletController");

router.get("/", authMiddleware, getWallet);

router.post("/fund", authMiddleware, fundWallet);

module.exports = router;