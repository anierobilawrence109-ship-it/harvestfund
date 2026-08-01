import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import Sidebar from "../components/Sidebar";
import Projects from "../components/Projects";
import "../styles/Dashboard.css";

function Dashboard() {
  const {
    walletBalance,
    investments,
    referralEarnings,
    loadWallet,
    loadInvestments,
    loadReferral,
  } = useContext(WalletContext);

  const [serverStatus, setServerStatus] = useState("Checking...");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // LOAD LOGGED-IN USER
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
      }
    }

    // LOAD LATEST DATA
    loadWallet();
    loadInvestments();
    loadReferral();

    // CHECK BACKEND
    fetch("harvestfund.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setServerStatus(data.message || "Backend Connected");
      })
      .catch(() => {
        setServerStatus("Backend Offline");
      });
  }, []);

  // CALCULATE DAILY EARNINGS
  const dailyEarnings = investments.reduce(
    (total, item) => {
      return total + Number(item.daily_return || 0);
    },
    0
  );

  // CALCULATE TOTAL INVESTED
  const totalInvested = investments.reduce(
    (total, item) => {
      return total + Number(item.amount || 0);
    },
    0
  );

  // USER NAME
  const userName =
    user?.full_name ||
    user?.fullName ||
    user?.name ||
    "Investor";

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN DASHBOARD */}
      <main className="main-content">

        {/* TOP HEADER */}
        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              HARVESTFUND DASHBOARD
            </p>

            <h1>
              Welcome back, {userName} 👋
            </h1>

            <p className="welcome-text">
              Manage your agricultural investments and grow
              your portfolio.
            </p>
          </div>

          <div className="server-badge">
            <span className="status-dot"></span>
            {serverStatus}
          </div>
        </div>

        {/* WALLET HERO CARD */}
        <section className="balance-card">

          <div className="balance-card-top">
            <div>
              <p>Total Wallet Balance</p>

              <h2>
                ₦{Number(walletBalance || 0).toLocaleString()}
              </h2>
            </div>

            <div className="wallet-icon">
              💰
            </div>
          </div>

          <div className="balance-card-bottom">

            <div>
              <span>Total Invested</span>
              <strong>
                ₦{totalInvested.toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Daily Earnings</span>
              <strong>
                ₦{dailyEarnings.toLocaleString()}
              </strong>
            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="quick-actions-grid">

            <button
              className="action-card fund-action"
              onClick={() =>
                (window.location.href = "/wallet")
              }
            >
              <span className="action-icon">💳</span>
              <span>Fund Wallet</span>
            </button>

            <button
              className="action-card invest-action"
              onClick={() =>
                (window.location.href = "/investments")
              }
            >
              <span className="action-icon">🌾</span>
              <span>Invest Now</span>
            </button>

            <button
              className="action-card withdraw-action"
              onClick={() =>
                (window.location.href = "/withdraw")
              }
            >
              <span className="action-icon">💸</span>
              <span>Withdraw</span>
            </button>

            <button
              className="action-card referral-action"
              onClick={() =>
                (window.location.href = "/referral")
              }
            >
              <span className="action-icon">👥</span>
              <span>My Referrals</span>
            </button>

          </div>

        </section>

        {/* STATISTICS */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <div className="stat-icon">
              🌾
            </div>

            <div>
              <span>Active Investments</span>
              <h3>{investments.length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              💸
            </div>

            <div>
              <span>Daily Earnings</span>
              <h3>
                ₦{dailyEarnings.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>Referral Earnings</span>
              <h3>
                ₦{Number(
                  referralEarnings || 0
                ).toLocaleString()}
              </h3>
            </div>
          </div>

        </section>

        {/* INVESTMENT PLANS */}
        <section className="investment-section">

          <div className="section-heading">
            <div>
              <p className="dashboard-label">
                OPPORTUNITIES
              </p>

              <h2>
                Grow With HarvestFund 🌱
              </h2>
            </div>

            <button
              className="view-all-btn"
              onClick={() =>
                (window.location.href = "/investments")
              }
            >
              View All →
            </button>
          </div>

          <Projects />

        </section>

      </main>

    </div>
  );
}

export default Dashboard;