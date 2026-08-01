import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/History.css";

function History() {
  const [transactions, setTransactions] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ===========================
  // LOAD TRANSACTIONS
  // ===========================
  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setServerMessage(
          "Please log in to view your transaction history."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://harvestfund.onrender.com/api/transactions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Transactions response:",
        data
      );

      if (response.ok) {
        setTransactions(
          Array.isArray(data.transactions)
            ? data.transactions
            : []
        );

        setServerMessage(
          data.message ||
            "Transactions retrieved successfully"
        );
      } else {
        setServerMessage(
          data.message ||
            "Unable to load transactions."
        );
      }
    } catch (error) {
      console.error(
        "Transactions Error:",
        error
      );

      setServerMessage(
        "Backend not connected"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // LOAD WHEN PAGE OPENS
  // ===========================
  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="history-page">

  <aside className="history-sidebar">
    <Sidebar />
  </aside>

  <main className="history-content">
        <h1>📜 Transaction History</h1>

        <p
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {serverMessage}
        </p>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map(
            (item, index) => (
              <div
                className="history-card"
                key={item.id || index}
              >
                <h3>
                  {item.type}
                </h3>

                <p>
                  Amount: ₦
                  {Number(
                    item.amount || 0
                  ).toLocaleString()}
                </p>

                <p>
                  Status:{" "}
                  {item.status}
                </p>

                {item.created_at && (
                  <p>
                    Date:{" "}
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </p>
                )}
              </div>
            )
          )
        )}
      </main>
    </div>
  );
}

export default History;