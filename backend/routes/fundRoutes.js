const express = require("express");
const router = express.Router();

const { submitFundingRequest } = require("../controllers/fundController");
const authMiddleware = require("../middleware/authMiddleware");

// Submit funding request
router.post("/submit", authMiddleware, submitFundingRequest);

module.exports = router;