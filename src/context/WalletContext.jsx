import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext();

const API_URL = "https://harvestfund.onrender.com";

export function WalletProvider({ children }) {
  const [walletBalance, setWalletBalance] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [activities, setActivities] = useState([]);

  const loadWallet = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(`${API_URL}/api/wallet`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.walletBalance !== undefined) {
        setWalletBalance(Number(data.walletBalance));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadInvestments = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(`${API_URL}/api/investment`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setInvestments(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadReferral = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(`${API_URL}/api/referrals`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setReferralEarnings(Number(data.referralEarnings || 0));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadWallet();
      loadInvestments();
      loadReferral();
    }
  }, []);

  const fundWallet = async (amount) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setWalletBalance(Number(data.walletBalance));

        setActivities((prev) => [
          `💰 Wallet funded with ₦${Number(amount).toLocaleString()}`,
          ...prev,
        ]);

        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

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
      const response = await fetch(`${API_URL}/api/investment/create`, {
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
      });

      const data = await response.json();

      if (response.ok) {
        setWalletBalance(Number(data.walletBalance));

        await loadInvestments();

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
      alert(error.message);
      return false;
    }
  };

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