import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletBalance, setWalletBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [activities, setActivities] = useState([]);

  // ===========================
  // LOAD WALLET
  // ===========================
  const loadWallet = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No login token found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/wallet",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Wallet response:", data);

      if (response.ok && data.walletBalance !== undefined) {
        setWalletBalance(Number(data.walletBalance));
      } else {
        console.log("Wallet error:", data);
      }
    } catch (error) {
      console.log("Wallet connection error:", error);
    }
  };

  // ===========================
  // LOAD INVESTMENTS
  // ===========================
  const loadInvestments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No login token found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/investment",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Investments response:", data);

      if (response.ok && Array.isArray(data)) {
        setInvestments(data);
      } else {
        console.log("Investments error:", data);
      }
    } catch (error) {
      console.log("Investments connection error:", error);
    }
  };

  // ===========================
  // LOAD REFERRAL DATA
  // ===========================
  const loadReferral = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No login token found");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/referrals",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Referral response:", data);

      if (response.ok) {
        setReferralEarnings(
          Number(data.referralEarnings || 0)
        );
      } else {
        console.log("Referral error:", data);
      }
    } catch (error) {
      console.log("Referral connection error:", error);
    }
  };

  // ===========================
  // LOAD DATA WHEN USER LOGS IN
  // ===========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadWallet();
      loadInvestments();
      loadReferral();
    }
  }, []);

  // ===========================
  // FUND WALLET
  // ===========================
  const fundWallet = async (amount) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/wallet/fund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWalletBalance(Number(data.walletBalance));

        setActivities((prev) => [
          `💰 Wallet funded with ₦${Number(
            amount
          ).toLocaleString()}`,
          ...prev,
        ]);

        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Fund Wallet Error:", error);
      alert(`Fund Wallet Error: ${error.message}`);
    }
  };

  // ===========================
  // INVEST
  // ===========================
  const invest = async (planName, amount) => {
    amount = Number(amount);

    let dailyReturn = 0;
    let duration = 0;

    if (planName.includes("Maize")) {
      dailyReturn = 500;
      duration = 30;
    } else if (planName.includes("Poultry")) {
      dailyReturn = 1500;
      duration = 30;
    } else if (planName.includes("Rice")) {
      dailyReturn = 2000;
      duration = 60;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/investment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            plan_name: planName,
            amount,
            daily_return: dailyReturn,
            duration,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update wallet with real Supabase balance
        setWalletBalance(Number(data.walletBalance));

        // Reload investments from Supabase
        await loadInvestments();

        // Add activity
        setActivities((prev) => [
          `🌾 Invested ₦${amount.toLocaleString()} in ${planName}`,
          ...prev,
        ]);

        alert(data.message);

        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (error) {
      console.error("Investment Error:", error);
      alert(`Investment Error: ${error.message}`);
      return false;
    }
  };

  // ===========================
  // TEMP WITHDRAW
  // ===========================
  const withdraw = (amount) => {
    amount = Number(amount);

    if (walletBalance < amount) {
      alert("Insufficient wallet balance!");
      return false;
    }

    setWalletBalance((prev) => prev - amount);

    setActivities((prev) => [
      `💸 Withdrawn ₦${amount.toLocaleString()}`,
      ...prev,
    ]);

    return true;
  };

  // ===========================
  // PROVIDER
  // ===========================
  return (
    <WalletContext.Provider
      value={{
        walletBalance,
        setWalletBalance,

        loadWallet,
        loadInvestments,
        loadReferral,

        fundWallet,

        investments,
        invest,

        withdraw,

        referralEarnings,

        activities,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}