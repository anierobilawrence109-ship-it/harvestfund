const supabase = require("../config/supabase");

// ==========================================
// GET USER TRANSACTIONS
// ==========================================
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("transactions")
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
      transactions: data || [],
      message: "Transactions retrieved successfully",
    });
  } catch (error) {
    console.error(
      "Get Transactions Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// ADD TRANSACTION
// ==========================================
exports.addTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      type,
      amount,
      status,
    } = req.body;

    if (!type || amount === undefined) {
      return res.status(400).json({
        message:
          "Type and amount are required",
      });
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: userId,
          type,
          amount: Number(amount),
          status:
            status || "Completed",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    res.status(201).json({
      message:
        "Transaction added successfully",
      transaction: data,
    });
  } catch (error) {
    console.error(
      "Add Transaction Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};