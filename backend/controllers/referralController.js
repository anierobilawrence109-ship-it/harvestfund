const supabase = require("../config/supabase");

// ==============================
// GENERATE REFERRAL CODE
// ==============================
const generateReferralCode = () => {
  return (
    "HF-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );
};

// ==============================
// GET REFERRAL DETAILS
// ==============================
exports.getReferral = async (req, res) => {
  try {
    const userId = req.user.id;

    // ==========================================
    // FIND USER REFERRAL RECORD
    // ==========================================
    let {
      data: referral,
      error,
    } = await supabase
      .from("referrals")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    // ==========================================
    // CREATE REFERRAL RECORD IF NOT FOUND
    // ==========================================
    if (!referral) {
      const referralCode =
        generateReferralCode();

      const {
        data: newReferral,
        error: createError,
      } = await supabase
        .from("referrals")
        .insert([
          {
            user_id: userId,
            referral_code: referralCode,
            total_referrals: 0,
            referral_earnings: 0,
          },
        ])
        .select()
        .single();

      if (createError) {
        return res.status(500).json({
          message:
            createError.message,
        });
      }

      referral = newReferral;
    }

    // ==========================================
    // RETURN REFERRAL DETAILS
    // ==========================================
    res.status(200).json({
      referralCode:
        referral.referral_code,

      totalReferrals:
        Number(
          referral.total_referrals || 0
        ),

      referralEarnings:
        Number(
          referral.referral_earnings || 0
        ),

      message:
        "Referral details retrieved successfully",
    });
  } catch (error) {
    console.error(
      "Get Referral Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// ==============================
// CLAIM REFERRAL BONUS
// ==============================
exports.claimReferralBonus =
  async (req, res) => {
    try {
      const userId =
        req.user.id;

      // ==========================================
      // GET REFERRAL RECORD
      // ==========================================
      const {
        data: referral,
        error:
          referralError,
      } = await supabase
        .from("referrals")
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .maybeSingle();

      if (referralError) {
        return res.status(500).json({
          message:
            referralError.message,
        });
      }

      if (!referral) {
        return res.status(404).json({
          message:
            "Referral record not found",
        });
      }

      // ==========================================
      // CHECK AVAILABLE BONUS
      // ==========================================
      const bonus =
        Number(
          referral.referral_earnings ||
            0
        );

      if (bonus <= 0) {
        return res.status(400).json({
          message:
            "No referral bonus available to claim",
        });
      }

      // ==========================================
      // GET USER WALLET
      // ==========================================
      const {
        data: wallet,
        error:
          walletError,
      } = await supabase
        .from("wallets")
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .maybeSingle();

      if (walletError) {
        return res.status(500).json({
          message:
            walletError.message,
        });
      }

      if (!wallet) {
        return res.status(404).json({
          message:
            "Wallet not found",
        });
      }

      // ==========================================
      // CALCULATE NEW BALANCE
      // ==========================================
      const newBalance =
        Number(
          wallet.balance || 0
        ) + bonus;

      // ==========================================
      // UPDATE WALLET
      // ==========================================
      const {
        error:
          walletUpdateError,
      } = await supabase
        .from("wallets")
        .update({
          balance:
            newBalance,
        })
        .eq(
          "user_id",
          userId
        );

      if (walletUpdateError) {
        return res.status(500).json({
          message:
            walletUpdateError.message,
        });
      }

      // ==========================================
      // RESET REFERRAL EARNINGS
      // ==========================================
      const {
        error:
          referralUpdateError,
      } = await supabase
        .from("referrals")
        .update({
          referral_earnings: 0,
        })
        .eq(
          "user_id",
          userId
        );

      // ==========================================
      // IF RESET FAILED
      // ==========================================
      if (referralUpdateError) {
        // Try to reverse wallet credit
        await supabase
          .from("wallets")
          .update({
            balance:
              Number(
                wallet.balance || 0
              ),
          })
          .eq(
            "user_id",
            userId
          );

        return res.status(500).json({
          message:
            referralUpdateError.message,
        });
      }

      // ==========================================
      // SAVE CLAIM TRANSACTION
      // ==========================================
      const {
        error:
          transactionError,
      } = await supabase
        .from("transactions")
        .insert([
          {
            user_id:
              userId,

            type:
              "Referral Bonus",

            amount:
              bonus,

            status:
              "Completed",
          },
        ]);

      if (transactionError) {
        console.error(
          "Referral Claim Transaction Error:",
          transactionError.message
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================
      res.status(200).json({
        message:
          "Referral bonus claimed successfully",

        bonus,

        walletBalance:
          newBalance,
      });
    } catch (error) {
      console.error(
        "Claim Referral Bonus Error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };