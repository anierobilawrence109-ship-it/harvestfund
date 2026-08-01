import { useEffect, useState } from "react";
import "../styles/Admin.css";

function Admin() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalWalletBalance, setTotalWalletBalance] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);

  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState("");

  // ==========================================
  // LOAD ADMIN STATISTICS
  // ==========================================
  const loadAdminStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://harvestfund.onrender.com/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTotalUsers(Number(data.totalUsers || 0));
        setTotalInvestments(Number(data.totalInvestments || 0));
        setTotalWalletBalance(Number(data.totalWalletBalance || 0));
        setPendingWithdrawals(
          Number(data.pendingWithdrawals || 0)
        );
      } else {
        setServerMessage(
          data.message || "Unable to load admin statistics."
        );
      }
    } catch (error) {
      console.error("Admin Stats Error:", error);
      setServerMessage("Unable to connect to server.");
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://harvestfund.onrender.com/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      } else {
        setServerMessage(
          data.message || "Unable to load users."
        );
      }
    } catch (error) {
      console.error("Users Error:", error);
      setServerMessage("Unable to connect to server.");
    } finally {
      setUsersLoading(false);
    }
  };

  // ==========================================
  // LOAD WITHDRAWALS
  // ==========================================
  const loadWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://harvestfund.onrender.com/api/withdrawals/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWithdrawals(data.withdrawals || []);
      } else {
        setServerMessage(
          data.message || "Unable to load withdrawals."
        );
      }
    } catch (error) {
      console.error("Withdrawals Error:", error);
      setServerMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ALL DATA
  // ==========================================
  useEffect(() => {
    loadAdminStats();
    loadUsers();
    loadWithdrawals();
  }, []);

  // ==========================================
  // UPDATE WITHDRAWAL
  // ==========================================
  const updateWithdrawalStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://harvestfund.onrender.com/api/withdrawals/admin/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        await loadWithdrawals();
        await loadAdminStats();
      } else {
        alert(
          data.message || "Unable to update withdrawal."
        );
      }
    } catch (error) {
      console.error("Update Withdrawal Error:", error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="admin-page">

      {/* =====================================
          ADMIN HEADER
      ====================================== */}
      <header className="admin-header">
        <div>
          <div className="admin-logo">
            🌱 HarvestFund
          </div>

          <p>Administration Control Center</p>
        </div>

        <div className="admin-badge">
          👨‍💼 Administrator
        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <main className="admin-content">

        <h1>Admin Dashboard</h1>

        <p className="admin-subtitle">
          Monitor platform activity and manage withdrawal requests.
        </p>

        {serverMessage && (
          <div className="admin-message">
            {serverMessage}
          </div>
        )}

        {/* =====================================
            STATISTICS
        ====================================== */}
        <section className="admin-stats">

          <div className="admin-stat-card">
            <span>👥</span>
            <div>
              <p>Total Users</p>
              <h2>{totalUsers}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span>🌾</span>
            <div>
              <p>Total Investments</p>
              <h2>
                ₦{totalInvestments.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span>💰</span>
            <div>
              <p>Total Wallet Balance</p>
              <h2>
                ₦{totalWalletBalance.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="admin-stat-card pending">
            <span>💸</span>
            <div>
              <p>Pending Withdrawals</p>
              <h2>{pendingWithdrawals}</h2>
            </div>
          </div>

        </section>

        {/* =====================================
            WITHDRAWAL REQUESTS
        ====================================== */}
        <section className="admin-section">

          <div className="section-heading">
            <div>
              <h2>💸 Withdrawal Requests</h2>
              <p>Review and manage user withdrawal requests.</p>
            </div>
          </div>

          {loading ? (
            <p className="empty-message">
              Loading withdrawals...
            </p>
          ) : withdrawals.length === 0 ? (
            <p className="empty-message">
              No withdrawal requests yet.
            </p>
          ) : (
            <div className="withdrawal-grid">

              {withdrawals.map((item) => (
                <div
                  className="admin-withdrawal-card"
                  key={item.id}
                >

                  <div className="withdrawal-top">
                    <div>
                      <p className="request-label">
                        Withdrawal Request
                      </p>

                      <h3>
                        ₦
                        {Number(
                          item.amount || 0
                        ).toLocaleString()}
                      </h3>
                    </div>

                    <span
                      className={`status ${String(
                        item.status
                      ).toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="withdrawal-details">

                    <p>
                      <strong>🏦 Bank:</strong>{" "}
                      {item.bank_name}
                    </p>

                    <p>
                      <strong>🔢 Account:</strong>{" "}
                      {item.account_number}
                    </p>

                    <p>
                      <strong>👤 Name:</strong>{" "}
                      {item.account_name}
                    </p>

                    <p>
                      <strong>📅 Date:</strong>{" "}
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleString()
                        : "N/A"}
                    </p>

                  </div>

                  {String(item.status).toLowerCase() ===
                    "pending" && (
                    <div className="withdrawal-actions">

                      <button
                        className="approve-btn"
                        onClick={() =>
                          updateWithdrawalStatus(
                            item.id,
                            "Approved"
                          )
                        }
                      >
                        ✅ Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateWithdrawalStatus(
                            item.id,
                            "Rejected"
                          )
                        }
                      >
                        ❌ Reject
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

        {/* =====================================
            REGISTERED USERS
        ====================================== */}
        <section className="admin-section">

          <div className="section-heading">
            <div>
              <h2>👥 Registered Users</h2>
              <p>View all users registered on HarvestFund.</p>
            </div>
          </div>

          {usersLoading ? (
            <p className="empty-message">
              Loading users...
            </p>
          ) : users.length === 0 ? (
            <p className="empty-message">
              No registered users found.
            </p>
          ) : (
            <div className="users-grid">

              {users.map((user) => (
                <div
                  className="admin-user-card"
                  key={user.id}
                >

                  <div className="user-avatar">
                    👤
                  </div>

                  <div className="user-info">

                    <h3>
                      {user.full_name}
                    </h3>

                    <p>
                      📧 {user.email}
                    </p>

                    <p>
                      📱{" "}
                      {user.phone ||
                        "Phone not provided"}
                    </p>

                    <small>
                      Joined:{" "}
                      {user.created_at
                        ? new Date(
                            user.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </small>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Admin;