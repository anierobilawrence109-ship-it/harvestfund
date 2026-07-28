import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Withdraw.css";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);

  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingWithdrawals, setLoadingWithdrawals] =
    useState(true);

  // ===========================
  // LOAD WALLET BALANCE
  // ===========================
  const loadWallet = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setServerMessage(
          "Please log in to withdraw funds."
        );
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/wallet",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWalletBalance(
          Number(data.walletBalance || 0)
        );
      } else {
        setServerMessage(
          data.message ||
            "Unable to load wallet."
        );
      }
    } catch (error) {
      console.error(
        "Wallet Error:",
        error
      );

      setServerMessage(
        "Backend not connected"
      );
    }
  };

  // ===========================
  // LOAD WITHDRAWAL HISTORY
  // ===========================
  const loadWithdrawals = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingWithdrawals(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/withdrawals",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Withdrawals response:",
        data
      );

      if (response.ok) {
        setWithdrawals(
          Array.isArray(data.withdrawals)
            ? data.withdrawals
            : []
        );
      } else {
        setServerMessage(
          data.message ||
            "Unable to load withdrawal history."
        );
      }
    } catch (error) {
      console.error(
        "Withdrawals Error:",
        error
      );

      setServerMessage(
        "Unable to load withdrawal history."
      );
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  // ===========================
  // LOAD DATA WHEN PAGE OPENS
  // ===========================
  useEffect(() => {
    loadWallet();
    loadWithdrawals();
  }, []);

  // ===========================
  // HANDLE WITHDRAWAL
  // ===========================
  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (
      !amount ||
      Number(amount) <= 0
    ) {
      setServerMessage(
        "Please enter a valid withdrawal amount."
      );
      return;
    }

    if (
      !bankName ||
      !accountNumber ||
      !accountName
    ) {
      setServerMessage(
        "Please fill in all bank details."
      );
      return;
    }

    if (
      Number(amount) >
      walletBalance
    ) {
      setServerMessage(
        "Insufficient wallet balance."
      );
      return;
    }

    try {
      setLoading(true);
      setServerMessage("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/withdrawals/create",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(amount),
            bank_name: bankName,
            account_number:
              accountNumber,
            account_name:
              accountName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update wallet balance
        setWalletBalance(
          Number(data.walletBalance || 0)
        );

        // Clear form
        setAmount("");
        setBankName("");
        setAccountNumber("");
        setAccountName("");

        setServerMessage(
          data.message ||
            "Withdrawal request submitted successfully."
        );

        // Reload withdrawal history
        await loadWithdrawals();
      } else {
        setServerMessage(
          data.message ||
            "Withdrawal request failed."
        );
      }
    } catch (error) {
      console.error(
        "Withdrawal Error:",
        error
      );

      setServerMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // HIDE ACCOUNT NUMBER
  // ===========================
  const hideAccountNumber = (
    accountNumber
  ) => {
    if (!accountNumber) {
      return "N/A";
    }

    const account = String(
      accountNumber
    );

    if (account.length <= 4) {
      return account;
    }

    return (
      "******" +
      account.slice(-4)
    );
  };

 return (
  <div className="withdraw-page">
    <aside className="withdraw-sidebar">
      <Sidebar />
    </aside>

    <main className="withdraw-content">
        <h1>💸 Withdraw Funds</h1>

        {/* ===========================
            WITHDRAWAL FORM
        ============================ */}
        <div className="withdraw-card">

          <h3>
            Available Balance: ₦
            {walletBalance.toLocaleString()}
          </h3>

          {serverMessage && (
            <p
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              {serverMessage}
            </p>
          )}

          <form
            onSubmit={handleWithdraw}
          >

            <input
              type="number"
              placeholder="Enter withdrawal amount"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              min="1"
            />

            <input
              type="text"
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) =>
                setBankName(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Account Number"
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) =>
                setAccountName(
                  e.target.value
                )
              }
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Submit Withdrawal"}
            </button>

          </form>
        </div>

        {/* ===========================
            WITHDRAWAL HISTORY
        ============================ */}
        <div className="withdrawal-history">
          <h2>
            📜 Withdrawal History
          </h2>

          {loadingWithdrawals ? (
            <p>
              Loading withdrawal history...
            </p>
          ) : withdrawals.length === 0 ? (
            <p>
              No withdrawal requests yet.
            </p>
          ) : (
            withdrawals.map(
              (item) => (
                <div
                  className="withdrawal-history-card"
                  key={item.id}
                >
                  <h3>
                    💸 ₦
                    {Number(
                      item.amount || 0
                    ).toLocaleString()}
                  </h3>

                  <p>
                    🏦 Bank:{" "}
                    {item.bank_name}
                  </p>

                  <p>
                    🔢 Account:{" "}
                    {hideAccountNumber(
                      item.account_number
                    )}
                  </p>

                  <p>
                    👤 Account Name:{" "}
                    {item.account_name}
                  </p>

                  <p>
                    📅 Date:{" "}
                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleString()
                      : "N/A"}
                  </p>

                  <p>
                    Status:{" "}
                    <strong>
                      {item.status}
                    </strong>
                  </p>
                </div>
              )
            )
          )}
        </div>

      </main>
    </div>
  );
}

export default Withdraw;