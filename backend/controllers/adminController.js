const supabase = require("../config/supabase");

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================
exports.getAdminStats = async (req, res) => {
  try {
    // ==========================================
    // TOTAL USERS
    // ==========================================
    const {
      count: totalUsers,
      error: usersError,
    } = await supabase
      .from("users")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (usersError) {
      return res.status(500).json({
        message: usersError.message,
      });
    }

    // ==========================================
    // TOTAL INVESTMENTS
    // ==========================================
    const {
      data: investments,
      error: investmentsError,
    } = await supabase
      .from("investments")
      .select("amount");

    if (investmentsError) {
      return res.status(500).json({
        message: investmentsError.message,
      });
    }

    const totalInvestments = (
      investments || []
    ).reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );

    // ==========================================
    // TOTAL WALLET BALANCE
    // ==========================================
    const {
      data: wallets,
      error: walletsError,
    } = await supabase
      .from("wallets")
      .select("balance");

    if (walletsError) {
      return res.status(500).json({
        message: walletsError.message,
      });
    }

    const totalWalletBalance = (
      wallets || []
    ).reduce(
      (total, item) =>
        total + Number(item.balance || 0),
      0
    );

    // ==========================================
    // PENDING WITHDRAWALS
    // ==========================================
    const {
      count: pendingWithdrawals,
      error: withdrawalsError,
    } = await supabase
      .from("withdrawals")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Pending");

    if (withdrawalsError) {
      return res.status(500).json({
        message: withdrawalsError.message,
      });
    }

    // ==========================================
    // SEND STATS
    // ==========================================
    res.status(200).json({
      totalUsers: totalUsers || 0,
      totalInvestments,
      totalWalletBalance,
      pendingWithdrawals:
        pendingWithdrawals || 0,
    });

  } catch (error) {
    console.error(
      "Admin Stats Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL REGISTERED USERS
// ==========================================
exports.getAllUsers = async (req, res) => {
  try {
    const {
      data: users,
      error,
    } = await supabase
      .from("users")
      .select(
        "id, full_name, email, phone, created_at"
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      users: users || [],
      message:
        "Users retrieved successfully",
    });

  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==========================================
// GET ALL FUNDING REQUESTS
// ==========================================
exports.getFundingRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("wallet_funding_requests")
      .select(`
        id,
        amount,
        receipt_url,
        status,
        created_at,
        user_id,
        users (
          full_name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(200).json({
      requests: data || [],
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// APPROVE FUNDING REQUEST
// ==========================================
exports.approveFundingRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: request, error } = await supabase
      .from("wallet_funding_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !request) {
      return res.status(404).json({
        message: "Funding request not found.",
      });
    }

    if (request.status === "Approved") {
      return res.status(400).json({
        message: "Already approved.",
      });
    }

    const { data: wallet, error: walletError } = await supabase
  .from("wallets")
  .select("*")
  .eq("user_id", request.user_id)
  .single();

if (walletError || !wallet) {
  return res.status(404).json({
    message: "User wallet not found.",
  });
}

    const newBalance =
      Number(wallet.balance || 0) +
      Number(request.amount);

    await supabase
      .from("wallets")
      .update({
        balance: newBalance,
      })
      .eq("user_id", request.user_id);

    await supabase
      .from("wallet_funding_requests")
      .update({
        status: "Approved",
      })
      .eq("id", id);

    await supabase
      .from("transactions")
      .insert([
        {
          user_id: request.user_id,
          type: "Wallet Funding",
          amount: request.amount,
          status: "Completed",
        },
      ]);

    res.status(200).json({
      message: "Funding approved successfully.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// REJECT FUNDING REQUEST
// ==========================================
exports.rejectFundingRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await supabase
      .from("wallet_funding_requests")
      .update({
        status: "Rejected",
      })
      .eq("id", id);

    res.status(200).json({
      message: "Funding request rejected.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};