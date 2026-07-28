const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getInvestments,
  createInvestment,
} = require("../controllers/investmentController");

router.get("/", authMiddleware, getInvestments);

router.post("/create", authMiddleware, createInvestment);

module.exports = router;