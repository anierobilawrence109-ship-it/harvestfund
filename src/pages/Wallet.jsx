import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Wallet.css";

function Wallet() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    fetch("https://harvestfund.onrender.com/api/wallet", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.walletBalance !== undefined) {
          setWalletBalance(Number(data.walletBalance));
        }

        if (data.message) {
          setServerMessage(data.message);
        }
      })
      .catch(() => {
        setServerMessage("Backend not connected");
      });
  }, []);

  const handleFundWallet = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      const response = await fetch(
        "https://harvestfund.onrender.com/api/wallet/fund",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWalletBalance(Number(data.walletBalance));
        setAmount("");
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="wallet-page">
      <Sidebar />

      <div className="wallet-content">
        <h1>💰 My Wallet</h1>

        <p style={{ color: "green", fontWeight: "bold" }}>
          {serverMessage}
        </p>

        <div className="balance-card">
          <h2>Available Balance</h2>
          <h3>₦{walletBalance.toLocaleString()}</h3>
        </div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="wallet-input"
        />

        <button
          className="fund-btn"
          onClick={handleFundWallet}
        >
          Fund Wallet
        </button>

        <div className="quick-amounts">
          <h2>Quick Amounts</h2>

          <div className="amount-buttons">
            <button onClick={() => setAmount(5000)}>₦5,000</button>
            <button onClick={() => setAmount(10000)}>₦10,000</button>
            <button onClick={() => setAmount(20000)}>₦20,000</button>
            <button onClick={() => setAmount(50000)}>₦50,000</button>
          </div>
        </div>

        <div className="transactions">
          <h2>Transaction History</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default Wallet;