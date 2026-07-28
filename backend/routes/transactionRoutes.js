const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTransactions,
  addTransaction,
} = require("../controllers/transactionController");

router.get("/", authMiddleware, getTransactions);

router.post("/add", authMiddleware, addTransaction);

module.exports = router;