const supabase = require("../config/supabase");

// ==========================================
// CREATE WITHDRAWAL REQUEST
// ==========================================
exports.createWithdrawal = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      amount,
      bank_name,
      account_number,
      account_name,
    } = req.body;

    // ==============================
    // VALIDATE INPUT
    // ==============================
    if (
      !amount ||
      Number(amount) <= 0 ||
      !bank_name ||
      !account_number ||
      !account_name
    ) {
      return res.status(400).json({
        message:
          "Amount and bank details are required",
      });
    }

    const withdrawalAmount = Number(amount);

    // ==============================
    // GET USER WALLET
    // ==============================
    const {
      data: wallet,
      error: walletError,
    } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    // ==============================
    // CHECK BALANCE
    // ==============================
    if (
      Number(wallet.balance) <
      withdrawalAmount
    ) {
      return res.status(400).json({
        message:
          "Insufficient wallet balance",
      });
    }

    // ==============================
    // DEDUCT WALLET BALANCE
    // ==============================
    const newBalance =
      Number(wallet.balance) -
      withdrawalAmount;

    const {
      error: updateWalletError,
    } = await supabase
      .from("wallets")
      .update({
        balance: newBalance,
      })
      .eq("user_id", userId);

    if (updateWalletError) {
      return res.status(500).json({
        message:
          updateWalletError.message,
      });
    }

    // ==============================
    // CREATE WITHDRAWAL REQUEST
    // ==============================
    const {
      data: withdrawal,
      error: withdrawalError,
    } = await supabase
      .from("withdrawals")
      .insert([
        {
          user_id: userId,
          amount: withdrawalAmount,
          bank_name,
          account_number,
          account_name,
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (withdrawalError) {
      // IMPORTANT:
      // If withdrawal creation fails,
      // restore the wallet balance.
      await supabase
        .from("wallets")
        .update({
          balance: Number(wallet.balance),
        })
        .eq("user_id", userId);

      return res.status(500).json({
        message:
          withdrawalError.message,
      });
    }

    // ==============================
    // SAVE TRANSACTION
    // ==============================
    const {
      error: transactionError,
    } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          type: "Withdrawal",
          amount: withdrawalAmount,
          status: "Pending",
        },
      ]);

    if (transactionError) {
      console.error(
        "Transaction Error:",
        transactionError
      );
    }

    // ==============================
    // SUCCESS
    // ==============================
    res.status(201).json({
      message:
        "Withdrawal request submitted successfully",
      withdrawal,
      walletBalance: newBalance,
    });
  } catch (error) {
    console.error(
      "Withdrawal Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET USER WITHDRAWALS
// ==========================================
exports.getWithdrawals = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const {
      data,
      error,
    } = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      withdrawals: data || [],
      message:
        "Withdrawals retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// ADMIN: GET ALL WITHDRAWALS
// ==========================================
exports.getAllWithdrawals = async (req, res) => {
  try {
    const {
      data,
      error,
    } = await supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      withdrawals: data || [],
      message: "All withdrawals retrieved successfully",
    });

  } catch (error) {
    console.error(
      "Get All Withdrawals Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// ADMIN: UPDATE WITHDRAWAL STATUS
// ==========================================
exports.updateWithdrawalStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ==========================================
    // VALIDATE STATUS
    // ==========================================
    if (
      !status ||
      !["Approved", "Rejected"].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Status must be Approved or Rejected",
      });
    }

    // ==========================================
    // PROCESS WITHDRAWAL ATOMICALLY
    // ==========================================
    const {
      data,
      error,
    } = await supabase.rpc(
      "process_withdrawal_status",
      {
        withdrawal_id: id,
        new_status: status,
      }
    );

    if (error) {
      console.error(
        "Process Withdrawal RPC Error:",
        error
      );

      return res.status(500).json({
        message: error.message,
      });
    }

    // ==========================================
    // CHECK RESULT
    // ==========================================
    if (!data || data.success !== true) {
      return res.status(400).json({
        message:
          data?.message ||
          "Unable to process withdrawal",
      });
    }

    // ==========================================
    // SUCCESS
    // ==========================================
    res.status(200).json({
      message:
        data.message,
    });

  } catch (error) {
    console.error(
      "Update Withdrawal Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};