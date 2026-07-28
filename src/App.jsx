import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import PublicProjects from "./components/PublicProjects";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Investments from "./pages/Investments";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Withdraw from "./pages/Withdraw";
import Admin from "./pages/Admin";
import Referral from "./pages/Referral";

import ProtectedRoute from "./components/ProtectedRoute";

// ==========================================
// PUBLIC HOME PAGE
// ==========================================
function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    <PublicProjects />
      <Footer />
    </>
  );
}

// ==========================================
// APP
// ==========================================
function App() {
  return (
    <Routes>

      {/* =====================================
          PUBLIC HOME PAGE
          Anyone can view this page
      ====================================== */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* =====================================
          PUBLIC AUTHENTICATION PAGES
      ====================================== */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* =====================================
          PROTECTED DASHBOARD
          Login required
      ====================================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED WALLET
      ====================================== */}
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED INVESTMENTS
      ====================================== */}
      <Route
        path="/investments"
        element={
          <ProtectedRoute>
            <Investments />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED HISTORY
      ====================================== */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED PROFILE
      ====================================== */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED SETTINGS
      ====================================== */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED WITHDRAW
      ====================================== */}
      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <Withdraw />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED ADMIN
      ====================================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* =====================================
          PROTECTED REFERRAL
      ====================================== */}
      <Route
        path="/referral"
        element={
          <ProtectedRoute>
            <Referral />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;