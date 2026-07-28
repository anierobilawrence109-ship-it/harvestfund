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