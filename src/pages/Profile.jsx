import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import Sidebar from "../components/Sidebar";
import "../styles/Profile.css";

function Profile() {
  const { walletBalance, investments } =
    useContext(WalletContext);

  const [user, setUser] = useState(null);
  const [serverMessage, setServerMessage] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "https://harvestfund.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setServerMessage(
            data.message || ""
          );
        } else {
          setServerMessage(
            data.message ||
              "Unable to load profile."
          );
        }
      } catch (error) {
        setServerMessage(
          "Backend not connected"
        );
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="profile-page">

      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <Sidebar />
      </aside>

      {/* MAIN PROFILE CONTENT */}
      <main className="profile-content">

        <div className="profile-header">
          <p className="profile-label">
            HARVESTFUND ACCOUNT
          </p>

          <h1>👤 My Profile</h1>

          <p className="profile-subtitle">
            Manage your personal information
            and view your account details.
          </p>
        </div>

        {serverMessage && (
          <p className="server-message">
            {serverMessage}
          </p>
        )}

        <div className="profile-card">

          <h2>Personal Information</h2>

          {user ? (
            <div className="profile-info">

              <div className="info-row">
                <strong>Full Name</strong>
                <span>
                  {user.full_name}
                </span>
              </div>

              <div className="info-row">
                <strong>Email Address</strong>
                <span>
                  {user.email}
                </span>
              </div>

              <div className="info-row">
                <strong>Phone Number</strong>
                <span>
                  {user.phone || "Not provided"}
                </span>
              </div>

              <div className="info-row">
                <strong>Wallet Balance</strong>
                <span>
                  ₦{walletBalance.toLocaleString()}
                </span>
              </div>

              <div className="info-row">
                <strong>Active Investments</strong>
                <span>
                  {investments.length}
                </span>
              </div>

            </div>
          ) : (
            <p>Loading profile...</p>
          )}

          <button className="edit-profile-btn">
            ✏️ Edit Profile
          </button>

        </div>

      </main>

    </div>
  );
}

export default Profile;