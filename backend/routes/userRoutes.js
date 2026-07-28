const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, full_name, email, phone")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }

    res.json({
      message: "Profile retrieved successfully.",
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      message: "Unable to load profile.",
    });
  }
});

module.exports = router;