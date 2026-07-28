import { NavLink, Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const isAdmin = user.role === "admin";

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <Link to="/" className="sidebar-logo">
        <span className="sidebar-logo-icon">🌱</span>

        <div>
          <strong>HarvestFund</strong>
          <small>Investor Portal</small>
        </div>
      </Link>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <p className="sidebar-title">
          MAIN MENU
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/wallet"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>💰</span>
          Wallet
        </NavLink>

       <NavLink
          to="/investments"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>🌾</span>
          Investments
        </NavLink>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span>👨‍💼</span>
            Admin Dashboard
          </NavLink>
        )}

        <p className="sidebar-title">
          ACCOUNT
        </p>

        <NavLink
          to="/referral"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>👥</span>
          Referral
        </NavLink>

        <NavLink
          to="/withdraw"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>💸</span>
          Withdraw
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>📜</span>
          History
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>👤</span>
          Profile
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span>⚙️</span>
          Settings
        </NavLink>

      </nav>

      {/* BOTTOM CARD */}
      <div className="sidebar-bottom">

        <div className="sidebar-support-icon">
          💬
        </div>

        <div>
          <strong>Need Help?</strong>
          <small>Contact our support team</small>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;