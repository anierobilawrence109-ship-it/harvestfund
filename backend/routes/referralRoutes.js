const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getReferral,
  claimReferralBonus,
} = require("../controllers/referralController");

router.get("/", authMiddleware, getReferral);

router.post("/claim", authMiddleware, claimReferralBonus);

module.exports = router;