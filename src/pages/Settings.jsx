import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [serverMessage, setServerMessage] = useState("");

  // Change Password states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/", {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") || ""
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setServerMessage(data.message);
        }
      })
      .catch(() => {
        setServerMessage("Backend not connected");
      });
  }, []);

  // =======================
  // CHANGE PASSWORD
  // =======================
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("token") || ""
            }`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");

        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        setShowPasswordForm(false);
      } else {
        alert(data.message || "Unable to change password.");
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  // =======================
  // LOGOUT
  // =======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="settings-page">

      <aside className="settings-sidebar">
        <Sidebar />
      </aside>

      <main className="settings-content">

        <h1>⚙️ Settings</h1>

        <p style={{ color: "green", fontWeight: "bold" }}>
          {serverMessage}
        </p>

        <div className="settings-card">

          <h2>Account Settings</h2>

          {/* CHANGE PASSWORD BUTTON */}
          <button
            onClick={() =>
              setShowPasswordForm(!showPasswordForm)
            }
          >
            🔑 Change Password
          </button>

          {/* CHANGE PASSWORD FORM */}
          {showPasswordForm && (
            <form
              className="change-password-form"
              onSubmit={handleChangePassword}
            >

              {/* CURRENT PASSWORD */}
              <div className="password-field">

                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </button>

              </div>

              {/* NEW PASSWORD */}
              <div className="password-field">

                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>

              </div>

              {/* CONFIRM NEW PASSWORD */}
              <div className="password-field">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) =>
                    setConfirmNewPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>

              </div>

              <button
                type="submit"
                className="change-password-submit"
              >
                Update Password
              </button>

              <button
                type="button"
                className="cancel-password"
                onClick={() =>
                  setShowPasswordForm(false)
                }
              >
                Cancel
              </button>

            </form>
          )}

          <button>
            🔔 Notification Settings
          </button>

          <button>
            🔒 Privacy & Security
          </button>

          <button
          onClick={() => setShowHelpSupport(!showHelpSupport)}
          >
            🆘 Help & Support
          </button>
{showHelpSupport && (
  <div className="help-support-panel">

    <h3>🆘 Help & Support</h3>

    <p>
      Need help with your HarvestFund account?
      Our support team is here to assist you.
    </p>

    {/* EMAIL SUPPORT */}
    <a
      href="mailto:harvestfund109@gmail.com"
      className="support-option"
    >
      <span className="support-icon">📧</span>

      <span className="support-text">
        <strong>Contact Us via Email</strong>
        <small>
          harvestfund109@gmail.com
        </small>
      </span>

      <span className="support-arrow">→</span>
    </a>

    {/* TELEGRAM SUPPORT */}
    <a
      href="https://t.me/+m5DOiJmfzH8xYmZk"
      target="_blank"
      rel="noopener noreferrer"
      className="support-option"
    >
      <span className="support-icon">📱</span>

      <span className="support-text">
        <strong>Join Our Official Telegram Group</strong>
        <small>
          Connect with the HarvestFund community
        </small>
      </span>

      <span className="support-arrow">→</span>
    </a>

  </div>
)}
          <button onClick={handleLogout}>
            🚪 Logout
          </button>

        </div>

      </main>
    </div>
  );
}

export default Settings;