const supabase = require("../config/supabase");

// ==========================================
// ACTIVE INVESTMENT PLANS
// ==========================================
const ACTIVE_PLANS = {
  "Rice Plan": {
    amount: 4000,
    dailyReturn: 500,
    duration: 60,
  },

  "Beans Plan": {
    amount: 8000,
    dailyReturn: 1000,
    duration: 60,
  },

  "Plantain Plan": {
    amount: 16000,
    dailyReturn: 2000,
    duration: 60,
  },

  "Maize Plan": {
    amount: 32000,
    dailyReturn: 4000,
    duration: 60,
  },
};

// ==========================================
// PROCESS DAILY INVESTMENT EARNINGS
// ==========================================
const processDailyEarnings = async (userId) => {
  try {
    const {
      data: investments,
      error: investmentError,
    } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (investmentError) {
      throw new Error(investmentError.message);
    }

    if (!investments || investments.length === 0) {
      return;
    }

    // ==========================================
    // GET USER WALLET
    // ==========================================
    const {
      data: wallet,
      error: walletError,
    } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      throw new Error("Wallet not found");
    }

    let currentBalance = Number(wallet.balance || 0);

    const now = new Date();

    // ==========================================
    // PROCESS EACH INVESTMENT
    // ==========================================
    for (const investment of investments) {
      const lastEarningDate = new Date(
        investment.last_earning_date
      );

      const endDate = new Date(
        investment.end_date
      );

      const dailyReturn = Number(
        investment.daily_return || 0
      );

      if (dailyReturn <= 0) {
        continue;
      }

      // ==========================================
      // DETERMINE EARNING PERIOD
      // ==========================================
      const earningUntil =
        now < endDate ? now : endDate;

      const millisecondsPerDay =
        1000 * 60 * 60 * 24;

      // ==========================================
      // CALCULATE DAYS THAT HAVE PASSED
      //
      // IMPORTANT:
      // The first daily return was already credited
      // when the investment was created.
      //
      // Therefore, the scheduler only processes
      // earnings AFTER the first immediate earning.
      // ==========================================
      const daysPassed = Math.floor(
        (earningUntil - lastEarningDate) /
          millisecondsPerDay
      );

      if (daysPassed <= 0) {
        continue;
      }

      let successfullyProcessedDays = 0;

      // ==========================================
      // PROCESS EACH DAY SEPARATELY
      // ==========================================
      for (
        let day = 1;
        day <= daysPassed;
        day++
      ) {
        const earningDate = new Date(
          lastEarningDate
        );

        earningDate.setDate(
          earningDate.getDate() + day
        );

        const earningDateString =
          earningDate
            .toISOString()
            .split("T")[0];

        // ==========================================
        // CHECK IF EARNING ALREADY EXISTS
        // ==========================================
        const {
          data: existingEarning,
          error: earningCheckError,
        } = await supabase
          .from("investment_earnings")
          .select("id")
          .eq(
            "investment_id",
            investment.id
          )
          .eq(
            "earning_date",
            earningDateString
          )
          .maybeSingle();

        if (earningCheckError) {
          console.error(
            "Earning check error:",
            earningCheckError.message
          );

          continue;
        }

        // ==========================================
        // SKIP DUPLICATE
        // ==========================================
        if (existingEarning) {
          continue;
        }

        // ==========================================
        // RECORD EARNING FIRST
        //
        // The unique constraint on
        // investment_id + earning_date
        // protects against duplicate records.
        // ==========================================
        const {
          data: earningRecord,
          error: earningInsertError,
        } = await supabase
          .from("investment_earnings")
          .insert([
            {
              investment_id:
                investment.id,

              user_id:
                userId,

              earning_date:
                earningDateString,

              amount:
                dailyReturn,

              status:
                "Completed",
            },
          ])
          .select()
          .single();

        if (earningInsertError || !earningRecord) {
          console.error(
            "Earning record error:",
            earningInsertError?.message
          );

          // Do not credit wallet if earning
          // was not successfully recorded.
          continue;
        }

        // ==========================================
        // CREDIT WALLET
        // ==========================================
        currentBalance += dailyReturn;

        successfullyProcessedDays++;

        // ==========================================
        // SAVE TRANSACTION
        // ==========================================
        const {
          error: transactionError,
        } = await supabase
          .from("transactions")
          .insert([
            {
              user_id:
                userId,

              type:
                "Investment Earnings",

              amount:
                dailyReturn,

              status:
                "Completed",
            },
          ]);

        if (transactionError) {
          console.error(
            "Earnings transaction error:",
            transactionError.message
          );
        }
      }

      // ==========================================
      // MOVE LAST EARNING DATE FORWARD
      // ==========================================
      const newLastEarningDate =
        new Date(lastEarningDate);

      newLastEarningDate.setDate(
        newLastEarningDate.getDate() +
          daysPassed
      );

      // ==========================================
      // UPDATE TOTAL EARNED
      //
      // Only count earnings that were actually
      // processed successfully.
      // ==========================================
      const newTotalEarned =
        Number(
          investment.total_earned || 0
        ) +
        dailyReturn *
          successfullyProcessedDays;

      // ==========================================
      // CHECK IF INVESTMENT IS COMPLETED
      // ==========================================
      const investmentCompleted =
        newLastEarningDate >= endDate;

      // ==========================================
      // UPDATE INVESTMENT
      // ==========================================
      const {
        error: updateError,
      } = await supabase
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

      if (updateError) {
        console.error(
          "Investment update error:",
          updateError.message
        );
      }

      if (investmentCompleted) {
        console.log(
          `🏁 Investment ${investment.id} completed.`
        );
      }
    }

    // ==========================================
    // UPDATE WALLET BALANCE
    // ==========================================
    const {
      error: updateWalletError,
    } = await supabase
      .from("wallets")
      .update({
        balance:
          currentBalance,
      })
      .eq(
        "user_id",
        userId
      );

    if (updateWalletError) {
      throw new Error(
        updateWalletError.message
      );
    }
  } catch (error) {
    console.error(
      "Daily Earnings Error:",
      error
    );

    throw error;
  }
};

// ==========================================
// GET USER INVESTMENTS
// ==========================================
exports.getInvestments = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.id;

    // Process earnings that are due
    await processDailyEarnings(
      userId
    );

    const {
      data,
      error,
    } = await supabase
      .from("investments")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      return res.status(500).json({
        message:
          error.message,
      });
    }

    res.status(200).json(
      data || []
    );
  } catch (error) {
    console.error(
      "Get Investments Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// ==========================================
// CREATE INVESTMENT
// ==========================================
exports.createInvestment =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.user.id;

      const {
        plan_name,
      } = req.body;

      // ==========================================
      // VALIDATE PLAN
      // ==========================================
      if (!plan_name) {
        return res.status(400).json({
          message:
            "Investment plan is required",
        });
      }

      // ==========================================
      // ONLY ACTIVE PLANS CAN BE PURCHASED
      // ==========================================
      const selectedPlan =
        ACTIVE_PLANS[
          plan_name
        ];

      if (!selectedPlan) {
        return res.status(400).json({
          message:
            "This investment plan is not available yet",
        });
      }

      const amount =
        selectedPlan.amount;

      const dailyReturn =
        selectedPlan.dailyReturn;

      const duration =
        selectedPlan.duration;

      // ==========================================
      // GET WALLET
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
        .single();

      if (
        walletError ||
        !wallet
      ) {
        return res.status(404).json({
          message:
            "Wallet not found",
        });
      }

      // ==========================================
      // CHECK WALLET BALANCE
      // ==========================================
      if (
        Number(
          wallet.balance || 0
        ) < amount
      ) {
        return res.status(400).json({
          message:
            "Insufficient wallet balance",
        });
      }

      // ==========================================
      // CHECK FIRST INVESTMENT
      // ==========================================
      const {
        data:
          existingInvestments,
        error:
          existingInvestmentError,
      } = await supabase
        .from("investments")
        .select("id")
        .eq(
          "user_id",
          userId
        )
        .limit(1);

      if (
        existingInvestmentError
      ) {
        return res.status(500).json({
          message:
            existingInvestmentError.message,
        });
      }

      const isFirstInvestment =
        !existingInvestments ||
        existingInvestments.length ===
          0;

      // ==========================================
      // CREATE DATES
      // ==========================================
      const startDate =
        new Date();

      // The first daily return is credited
      // immediately, so today's date is recorded
      // as the first earning date.
      const lastEarningDate =
        new Date(
          startDate
        );

      const endDate =
        new Date(
          startDate
        );

      // We subtract 1 because the first daily
      // return is already paid immediately.
      //
      // Example:
      // 60-day plan = immediate Day 1
      // + 59 future daily earnings
      endDate.setDate(
        endDate.getDate() +
          duration -
          1
      );

      // ==========================================
      // FIRST DAILY RETURN
      // ==========================================
      const firstDailyReturn =
        dailyReturn;

      // ==========================================
      // CREATE INVESTMENT
      // ==========================================
      const {
        data: investment,
        error:
          investmentError,
      } = await supabase
        .from("investments")
        .insert([
          {
            user_id:
              userId,

            plan_name:
              plan_name,

            amount:
              amount,

            daily_return:
              dailyReturn,

            duration:
              duration,

            status:
              "active",

            start_date:
              startDate.toISOString(),

            last_earning_date:
              lastEarningDate.toISOString(),

            end_date:
              endDate.toISOString(),

            // First daily earning is credited
            // immediately.
            total_earned:
              firstDailyReturn,
          },
        ])
        .select()
        .single();

      if (
        investmentError
      ) {
        return res.status(500).json({
          message:
            investmentError.message,
        });
      }

      // ==========================================
      // RECORD FIRST DAILY EARNING
      // ==========================================
      const today =
        startDate
          .toISOString()
          .split("T")[0];

      const {
        data: firstEarningRecord,
        error:
          firstEarningError,
      } = await supabase
        .from(
          "investment_earnings"
        )
        .insert([
          {
            investment_id:
              investment.id,

            user_id:
              userId,

            earning_date:
              today,

            amount:
              firstDailyReturn,

            status:
              "Completed",
          },
        ])
        .select()
        .single();

      if (
        firstEarningError ||
        !firstEarningRecord
      ) {
        // Rollback investment
        await supabase
          .from("investments")
          .delete()
          .eq(
            "id",
            investment.id
          );

        return res.status(500).json({
          message:
            "Unable to record first daily earning",
        });
      }

      // ==========================================
      // UPDATE WALLET
      //
      // Deduct investment amount
      // Then immediately add first daily return
      // ==========================================
      const newBalance =
        Number(
          wallet.balance || 0
        ) -
        amount +
        firstDailyReturn;

      const {
        error:
          updateWalletError,
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

      if (
        updateWalletError
      ) {
        // Rollback earning
        await supabase
          .from(
            "investment_earnings"
          )
          .delete()
          .eq(
            "investment_id",
            investment.id
          );

        // Rollback investment
        await supabase
          .from("investments")
          .delete()
          .eq(
            "id",
            investment.id
          );

        return res.status(500).json({
          message:
            "Unable to update wallet balance",
        });
      }

      // ==========================================
      // INVESTMENT TRANSACTION
      // ==========================================
      const {
        error:
          investmentTransactionError,
      } = await supabase
        .from("transactions")
        .insert([
          {
            user_id:
              userId,

            type:
              "Investment",

            amount:
              amount,

            status:
              "Completed",
          },
        ]);

      if (
        investmentTransactionError
      ) {
        console.error(
          "Investment transaction error:",
          investmentTransactionError.message
        );
      }

      // ==========================================
      // FIRST DAILY EARNING TRANSACTION
      // ==========================================
      const {
        error:
          earningTransactionError,
      } = await supabase
        .from("transactions")
        .insert([
          {
            user_id:
              userId,

            type:
              "Investment Earnings",

            amount:
              firstDailyReturn,

            status:
              "Completed",
          },
        ]);

      if (
        earningTransactionError
      ) {
        console.error(
          "First earning transaction error:",
          earningTransactionError.message
        );
      }

      // ==========================================
      // REFERRAL BONUS
      //
      // 10% OF FIRST INVESTMENT
      // ==========================================
      if (
        isFirstInvestment
      ) {
        const {
          data: user,
          error:
            userError,
        } = await supabase
          .from("users")
          .select(
            "referred_by"
          )
          .eq(
            "id",
            userId
          )
          .single();

        if (
          !userError &&
          user?.referred_by
        ) {
          const referralBonus =
            amount * 0.10;

          // ==========================================
          // GET REFERRER RECORD
          // ==========================================
          const {
            data:
              referralRecord,
            error:
              referralError,
          } = await supabase
            .from(
              "referrals"
            )
            .select("*")
            .eq(
              "user_id",
              user.referred_by
            )
            .maybeSingle();

          if (
            !referralError &&
            referralRecord
          ) {
            const newReferralEarnings =
              Number(
                referralRecord.referral_earnings ||
                  0
              ) +
              referralBonus;

            const newTotalReferrals =
              Number(
                referralRecord.total_referrals ||
                  0
              ) +
              1;

            // Update referral record
            const {
              error:
                referralUpdateError,
            } = await supabase
              .from(
                "referrals"
              )
              .update({
                referral_earnings:
                  newReferralEarnings,

                total_referrals:
                  newTotalReferrals,
              })
              .eq(
                "user_id",
                user.referred_by
              );

            if (
              referralUpdateError
            ) {
              console.error(
                "Referral update error:",
                referralUpdateError.message
              );
            } else {
              // ==========================================
              // SAVE REFERRAL TRANSACTION
              // ==========================================
              await supabase
                .from(
                  "transactions"
                )
                .insert([
                  {
                    user_id:
                      user.referred_by,

                    type:
                      "Referral Bonus",

                    amount:
                      referralBonus,

                    status:
                      "Pending",
                  },
                ]);
            }
          }
        }
      }

      // ==========================================
      // SUCCESS
      // ==========================================
      res.status(201).json({
        message:
          "Investment Successful. Your first daily return has been credited.",

        investment,

        walletBalance:
          newBalance,
      });
    } catch (error) {
      console.error(
        "Investment Error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };