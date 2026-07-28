const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

// =======================
// REGISTER
// =======================
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      referralCode,
    } = req.body;
// =======================
// VALIDATE REQUIRED FIELDS
// =======================
if (!fullName || !email || !phone || !password) {
  return res.status(400).json({
    message:
      "Full name, email, phone number, and password are required.",
  });
}
    // =======================
    // CHECK EXISTING USER
    // =======================
    const { data: existingUser, error: existingUserError } =
      await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (existingUserError) {
      return res.status(500).json({
        message: existingUserError.message,
      });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // =======================
    // FIND REFERRER
    // =======================
    let referrerId = null;

    if (referralCode && referralCode.trim() !== "") {
      const { data: referrer, error: referralError } =
        await supabase
          .from("referrals")
          .select("user_id")
          .eq(
            "referral_code",
            referralCode.trim().toUpperCase()
          )
          .maybeSingle();

      if (referralError) {
        return res.status(500).json({
          message: referralError.message,
        });
      }

      if (!referrer) {
        return res.status(400).json({
          message: "Invalid referral code",
        });
      }

      referrerId = referrer.user_id;
    }

    // =======================
    // HASH PASSWORD
    // =======================
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const userId = randomUUID();

    // =======================
    // CREATE USER
    // =======================
    const { error: registerError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          full_name: fullName,
          email,
          phone,
          password: hashedPassword,
          referred_by: referrerId,
        },
      ]);

    if (registerError) {
      return res.status(400).json({
        message: registerError.message,
      });
    }

    // =======================
    // CREATE WALLET
    // =======================
    const { error: walletError } = await supabase
      .from("wallets")
      .insert([
        {
          user_id: userId,
          balance: 500,
        },
      ]);

    if (walletError) {
      console.log(
        "Wallet creation error:",
        walletError.message
      );
    }

    // =======================
    // SAVE WELCOME BONUS
    // =======================
    const { error: transactionError } =
      await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            type: "Welcome Bonus",
            amount: 500,
            status: "Completed",
          },
        ]);

    if (transactionError) {
      console.log(
        "Welcome bonus transaction error:",
        transactionError.message
      );
    }

    // =======================
    // UPDATE REFERRER
    // =======================
    if (referrerId) {
      const { data: referralRecord, error: referralRecordError } =
        await supabase
          .from("referrals")
          .select("total_referrals")
          .eq("user_id", referrerId)
          .maybeSingle();

      if (referralRecordError) {
        console.log(
          "Referral record error:",
          referralRecordError.message
        );
      } else if (referralRecord) {
        const newTotalReferrals =
          Number(referralRecord.total_referrals || 0) + 1;

        await supabase
          .from("referrals")
          .update({
            total_referrals: newTotalReferrals,
          })
          .eq("user_id", referrerId);
      }
    }

    // =======================
    // SUCCESS
    // =======================
    res.status(201).json({
      message: "Registration Successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================
// LOGIN
// =======================
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // =======================
    // VALIDATE INPUT
    // =======================
    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone number and password are required",
      });
    }

    // =======================
    // FIND USER BY PHONE
    // =======================
    const {
      data: user,
      error,
    } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (error || !user) {
      return res.status(400).json({
        message: "Invalid Phone Number or Password",
      });
    }

    // =======================
    // CHECK PASSWORD
    // =======================
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid Phone Number or Password",
      });
    }

    // =======================
    // CREATE JWT TOKEN
    // =======================
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =======================
    // SUCCESS
    // =======================
    res.status(200).json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
  // =======================
// CHANGE PASSWORD
// =======================
exports.changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // =======================
    // VALIDATE INPUT
    // =======================
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required.",
      });
    }

    // =======================
    // GET LOGGED-IN USER
    // =======================
    const userId = req.user.id;

    // =======================
    // FIND USER
    // =======================
    const { data: user, error } = await supabase
      .from("users")
      .select("id, password")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // =======================
    // CHECK CURRENT PASSWORD
    // =======================
    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    // =======================
    // HASH NEW PASSWORD
    // =======================
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // =======================
    // UPDATE PASSWORD
    // =======================
    const { error: updateError } =
      await supabase
        .from("users")
        .update({
          password: hashedPassword,
        })
        .eq("id", userId);

    if (updateError) {
      return res.status(500).json({
        message: updateError.message,
      });
    }

    // =======================
    // SUCCESS
    // =======================
    res.status(200).json({
      message:
        "Password changed successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }

};