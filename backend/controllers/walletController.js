const supabase = require("../config/supabase");

// ===========================
// GET WALLET
// ===========================
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;

    let { data: wallet, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Create wallet if it doesn't exist
    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from("wallets")
        .insert([
          {
            user_id: userId,
            balance: 0,
          },
        ])
        .select()
        .single();

      if (createError) {
        return res.status(500).json({
          message: createError.message,
        });
      }

      wallet = newWallet;
    }

    return res.status(200).json({
      walletBalance: wallet.balance,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// DIRECT FUNDING (DISABLED)
// ===========================
exports.fundWallet = async (req, res) => {
  return res.status(200).json({
    message:
      "Direct wallet funding has been disabled. Please submit a funding request.",
  });
};

// ===========================
// REQUEST WALLET FUNDING
// ===========================
exports.requestFunding = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, receipt_url } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const { error } = await supabase
      .from("wallet_funding_requests")
      .insert([
        {
          user_id: userId,
          amount: Number(amount),
          receipt_url: receipt_url || "",
          status: "Pending",
        },
      ]);

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      message:
        "Funding request submitted successfully. Please wait for admin approval.",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};