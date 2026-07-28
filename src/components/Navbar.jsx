import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo">
        <span>🌱</span>
        HarvestFund
      </Link>

      {/* NAVIGATION */}
      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/login">
          Invest
        </Link>

        <Link to="/login">
          About
        </Link>

        <Link
          to="/login"
          className="login-btn"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="signup-btn"
        >
          Sign Up
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;