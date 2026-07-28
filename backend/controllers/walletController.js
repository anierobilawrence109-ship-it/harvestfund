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

    res.status(200).json({
      walletBalance: wallet.balance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================
// FUND WALLET
// ===========================
exports.fundWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const { data: wallet, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    const newBalance =
      Number(wallet.balance) + Number(amount);

    const { error: updateError } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
      })
      .eq("user_id", userId);

    if (updateError) {
      return res.status(500).json({
        message: updateError.message,
      });
    }

    // Save transaction
    await supabase.from("transactions").insert([
      {
        user_id: userId,
        type: "Wallet Funding",
        amount,
        status: "Completed",
      },
    ]);

    res.status(200).json({
      message: "Wallet funded successfully",
      walletBalance: newBalance,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};