import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import "../styles/Referral.css";

function Referral() {
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  // ===========================
  // LOAD REFERRAL DETAILS
  // ===========================
  const loadReferralDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setServerMessage(
          "Please log in to view your referral details."
        );
        return;
      }

      const response = await fetch(
        "https://harvestfund.onrender.com/api/referrals",
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
        setReferralCode(data.referralCode || "");
        setTotalReferrals(
          Number(data.totalReferrals || 0)
        );
        setReferralEarnings(
          Number(data.referralEarnings || 0)
        );

        setServerMessage(
          data.message ||
            "Referral details retrieved successfully"
        );
      } else {
        setServerMessage(
          data.message ||
            "Unable to load referral details."
        );
      }
    } catch (error) {
      console.error(
        "Referral Error:",
        error
      );

      setServerMessage(
        "Backend not connected"
      );
    }
  };

  // ===========================
  // LOAD WHEN PAGE OPENS
  // ===========================
  useEffect(() => {
    loadReferralDetails();
  }, []);

  // ===========================
  // COPY REFERRAL CODE
  // ===========================
  const copyCode = () => {
    if (!referralCode) {
      return;
    }

    navigator.clipboard.writeText(
      referralCode
    );

    setMessage(
      "✅ Referral code copied!"
    );

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // ===========================
  // CLAIM REFERRAL BONUS
  // ===========================
  const claimReferralBonus = async () => {
    if (referralEarnings <= 0) {
      alert(
        "No referral bonus available to claim."
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please log in to claim your referral bonus."
        );
        return;
      }

      const response = await fetch(
        "https://harvestfund.onrender.com/api/referrals/claim",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Claim Referral Response:",
        data
      );

      if (response.ok) {
        alert(
          `🎉 ₦${Number(
            data.bonus
          ).toLocaleString()} referral bonus claimed successfully!`
        );

        // Reload referral details
        await loadReferralDetails();

        // Tell wallet-related components
        // that the wallet has changed
        window.dispatchEvent(
          new Event("walletUpdated")
        );
      } else {
        alert(
          data.message ||
            "Unable to claim referral bonus."
        );
      }
    } catch (error) {
      console.error(
        "Claim Referral Error:",
        error
      );

      alert(
        `Claim Error: ${error.message}`
      );
    }
  };

  return (
    <div className="referral-page">
      <Sidebar />

      <div className="referral-content">
        <h1>👥 Referral Program</h1>

        <p
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {serverMessage}
        </p>

        {/* ===========================
            REFERRAL CODE
        =========================== */}
        <div className="referral-card">
          <h2>Your Referral Code</h2>

          <div className="code-box">
            <h3>
              {referralCode || "Loading..."}
            </h3>

            <button onClick={copyCode}>
              📋 Copy Code
            </button>

            {message && (
              <p>{message}</p>
            )}
          </div>

          <p>
            Invite your friends using your
            referral code and earn bonuses
            when they make their first
            investment.
          </p>
        </div>

        {/* ===========================
            REFERRAL STATS
        =========================== */}
        <div className="stats">
          <div className="stat-card">
            <h3>Total Referrals</h3>

            <p>
              {totalReferrals}
            </p>
          </div>

          <div className="stat-card">
            <h3>Referral Earnings</h3>

            <p>
              ₦
              {referralEarnings.toLocaleString()}
            </p>

            {/* ===========================
                CLAIM BUTTON
            =========================== */}
            {referralEarnings > 0 && (
              <button
                onClick={
                  claimReferralBonus
                }
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                💰 Claim Referral Bonus
              </button>
            )}
          </div>
        </div>

        {/* ===========================
            REFERRAL REWARDS
        =========================== */}
        <div className="reward-card">
  <h2>Referral Rewards</h2>

  <p>🌾 Rice Plan (₦4,000) → Earn ₦400</p>

  <p>🫘 Beans Plan (₦8,000) → Earn ₦800</p>

  <p>🍌 Plantain Plan (₦16,000) → Earn ₦1,600</p>

  <p>🌽 Maize Plan (₦32,000) → Earn ₦3,200</p>

  <p
    style={{
      marginTop: "15px",
      fontWeight: "bold",
      color: "#1b5e20",
    }}
  >
    💰 You earn 10% of your referral's first investment.
  </p>
</div>
      </div>
    </div>
  );
}

export default Referral;