const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");
dns.setServers(["1.1.1.1","8.8.8.8"])
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const referralRoutes = require("./routes/referralRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const {
  processAutomaticEarnings,
} = require("./services/earningScheduler");

app.get("/", (req, res) => {
  res.json({
    message: "🌱 HarvestFund Backend Running",
  });
});
// ==========================================
// AUTOMATIC INVESTMENT EARNINGS
// ==========================================

// Run once when the server starts
processAutomaticEarnings();

// Check for earnings every hour
setInterval(() => {
  processAutomaticEarnings();
}, 60 * 60 * 1000);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/investment", investmentRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/withdrawals",
  withdrawalRoutes
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});