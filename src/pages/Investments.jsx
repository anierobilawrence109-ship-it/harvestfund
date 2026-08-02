import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Investments.css";

function Investments() {
  const [investments, setInvestments] = useState([]);
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    fetch("https://harvestfund.onrender.com/api/investment", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInvestments(data);
        } else if (data.message) {
          setServerMessage(data.message);
        }
      })
      .catch(() => {
        setServerMessage("Backend not connected");
      });
  }, []);

  const invest = async (
    plan_name,
    amount,
    daily_return,
    duration
  ) => {
    try {
      const response = await fetch(
        "https://harvestfund.onrender.com/api/investment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            plan_name,
            amount,
            daily_return,
            duration,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="investments-page">
      <Sidebar />

      <div className="investments-content">
        <h1>🌾 Investments</h1>

        <p style={{ color: "green", fontWeight: "bold" }}>
          {serverMessage}
        </p>

        <div className="investment-card">
  <h2>🌾 Rice Plan</h2>
  <p>Investment: ₦4,000</p>
  <p>Daily Earnings: ₦500</p>
  <p>Duration: 60 Days</p>

  <button onClick={() => invest("Rice Plan", 4000, 500, 60)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🫘 Beans Plan</h2>
  <p>Investment: ₦8,000</p>
  <p>Daily Earnings: ₦1,000</p>
  <p>Duration: 60 Days</p>

  <button onClick={() => invest("Beans Plan", 8000, 1000, 60)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🍌 Plantain Plan</h2>
  <p>Investment: ₦16,000</p>
  <p>Daily Earnings: ₦2,000</p>
  <p>Duration: 60 Days</p>

  <button onClick={() => invest("Plantain Plan", 16000, 2000, 60)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🌽 Maize Plan</h2>
  <p>Investment: ₦32,000</p>
  <p>Daily Earnings: ₦4,000</p>
  <p>Duration: 60 Days</p>

  <button onClick={() => invest("Maize Plan", 32000, 4000, 60)}>
    Invest
  </button>
</div>

        <hr />

        <h2>My Active Investments</h2>

        {investments.length === 0 ? (
          <p>No investments yet.</p>
        ) : (
          investments.map((item) => (
            <div className="investment-card" key={item.id}>
              <h3>{item.plan_name}</h3>

              <p>₦{Number(item.amount).toLocaleString()}</p>

              <p>Daily Return: ₦{Number(item.daily_return).toLocaleString()}</p>

              <p>Duration: {item.duration} Days</p>

              <span className="status active">
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Investments;