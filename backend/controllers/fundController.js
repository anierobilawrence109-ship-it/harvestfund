const supabase = require("../config/supabase");

// Submit Funding Request
exports.submitFundingRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, receipt_url } = req.body;

    if (!amount || !receipt_url) {
      return res.status(400).json({
        message: "Amount and receipt are required.",
      });
    }

    const { data, error } = await supabase
      .from("wallet_funding_requests")
      .insert([
        {
          user_id: userId,
          amount,
          receipt_url,
          status: "pending",
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
      message: "Funding request submitted successfully.",
      request: data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};