import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Wallet.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ykwqajqimrpkswvxypdr.supabase.co",
  "sb_publishable_rx2TLiUIKNYJXbtpMQoRNg_JAu_OS4u"
);

function Wallet() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
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

  const submitFundingRequest = async () => {
  if (!amount || Number(amount) <= 0) {
    alert("Enter a valid amount");
    return;
  }

  if (!receipt) {
    alert("Please upload your payment receipt.");
    return;
  }

  try {
    // Upload receipt to Supabase Storage
    const fileName = `${Date.now()}-${receipt.name}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(fileName, receipt);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("receipts")
      .getPublicUrl(fileName);

    const receipt_url = publicData.publicUrl;

    // Submit funding request
    const response = await fetch(
      "https://harvestfund.onrender.com/api/wallet/request-funding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          receipt_url,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert(result.message);

      setAmount("");
      setReceipt(null);

      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error(error);
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
<input
  type="file"
  accept="image/*,.pdf"
  onChange={(e) => setReceipt(e.target.files[0])}
  className="wallet-input"
/>
        <button
          className="fund-btn"
          onClick={submitFundingRequest}
        >
          Submit Funding Request
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