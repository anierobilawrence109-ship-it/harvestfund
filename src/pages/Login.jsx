import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
     const response = await fetch(
  "https://harvestfund.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login Successful!");

        navigate("/dashboard");
      } else {
        alert(
          data.message ||
            "Invalid phone number or password."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to server."
      );
    }
  };

  return (
    <div className="login-page">

      {/* BACKGROUND DECORATION */}
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      {/* LOGIN CARD */}
      <div className="login-card">

        {/* LOGO */}
        <Link
          to="/"
          className="login-logo"
        >
          <div className="login-logo-icon">
            🌱
          </div>

          <div>
            <h2>HarvestFund</h2>
            <span>
              Invest. Grow. Prosper.
            </span>
          </div>
        </Link>

        {/* HEADER */}
        <div className="login-header">
          <h1>
            Welcome Back 👋
          </h1>

          <p>
            Login to your HarvestFund
            account and continue growing
            your investment journey.
          </p>
        </div>

        {/* FORM */}
        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* PHONE */}
          <div className="input-group">

            <label>
              Phone Number
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                📱
              </span>

              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                required
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <label>
              Password
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-button"
          >
            Login to HarvestFund
            <span>→</span>
          </button>

        </form>

        {/* SIGNUP */}
        <div className="signup-section">

          <p>
            Don't have an account?
          </p>

          <Link to="/signup">
            Create a HarvestFund Account
          </Link>

        </div>

        {/* FOOTER */}
        <div className="login-footer">
          <span>🔐</span>
          Your account is securely protected
        </div>

      </div>

    </div>
  );
}

export default Login;