const supabase = require("../config/supabase");

// ==========================================
// PROCESS AUTOMATIC DAILY EARNINGS
// ==========================================
const processAutomaticEarnings = async () => {
  try {
    console.log("🌱 Checking for investment earnings...");

    // Get all active investments
    const { data: investments, error } = await supabase
      .from("investments")
      .select("*")
      .eq("status", "active");

    if (error) {
      console.error(
        "❌ Error loading investments:",
        error.message
      );
      return;
    }

    if (!investments || investments.length === 0) {
      console.log("ℹ️ No active investments found.");
      return;
    }

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const now = new Date();

    // Process each active investment
    for (const investment of investments) {
      try {
        const userId = investment.user_id;

        const lastEarningDate = new Date(
          investment.last_earning_date
        );

        const endDate = new Date(
          investment.end_date
        );

        // Don't process investments that have ended
        const earningUntil =
          now < endDate ? now : endDate;

        // Calculate complete days since last earning
        const daysPassed = Math.floor(
          (earningUntil - lastEarningDate) /
            millisecondsPerDay
        );

        if (daysPassed <= 0) {
          continue;
        }

        const dailyReturn = Number(
          investment.daily_return
        );

        const totalEarnings =
          dailyReturn * daysPassed;

        // ==========================================
        // GET USER WALLET
        // ==========================================
        const { data: wallet, error: walletError } =
          await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (walletError || !wallet) {
          console.error(
            `❌ Wallet not found for user ${userId}`
          );
          continue;
        }

        // ==========================================
        // UPDATE WALLET
        // ==========================================
        const newBalance =
          Number(wallet.balance) +
          totalEarnings;

        const { error: walletUpdateError } =
          await supabase
            .from("wallets")
            .update({
              balance: newBalance,
            })
            .eq("user_id", userId);

        if (walletUpdateError) {
          console.error(
            "❌ Wallet update failed:",
            walletUpdateError.message
          );
          continue;
        }

        // ==========================================
        // UPDATE INVESTMENT
        // ==========================================
        const newTotalEarned =
          Number(
            investment.total_earned || 0
          ) + totalEarnings;

        const newLastEarningDate =
          new Date(lastEarningDate);

        newLastEarningDate.setDate(
          newLastEarningDate.getDate() +
            daysPassed
        );

        const investmentCompleted =
          newLastEarningDate >= endDate;

        const { error: investmentUpdateError } =
          await supabase
            .from("investments")
            .update({
              last_earning_date:
                newLastEarningDate.toISOString(),

              total_earned:
                newTotalEarned,

              status:
                investmentCompleted
                  ? "completed"
                  : "active",
            })
            .eq(
              "id",
              investment.id
            );

        if (investmentUpdateError) {
          console.error(
            "❌ Investment update failed:",
            investmentUpdateError.message
          );
          continue;
        }

        // ==========================================
        // SAVE TRANSACTION
        // ==========================================
        await supabase
          .from("transactions")
          .insert([
            {
              user_id: userId,

              type:
                "Investment Earnings",

              amount:
                totalEarnings,

              status:
                "Completed",
            },
          ]);

        console.log(
          `✅ Credited ₦${totalEarnings.toLocaleString()} to user ${userId}`
        );

        if (investmentCompleted) {
          console.log(
            `🏁 Investment ${investment.id} completed.`
          );
        }
      } catch (investmentError) {
        console.error(
          "❌ Error processing investment:",
          investmentError.message
        );
      }
    }

    console.log(
      "🌱 Automatic earnings check completed."
    );
  } catch (error) {
    console.error(
      "❌ Automatic earnings scheduler error:",
      error.message
    );
  }
};

module.exports = {
  processAutomaticEarnings,
};