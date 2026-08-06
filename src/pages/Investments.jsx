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
  <h2>🌽 Maize Plan</h2>
  <p>Investment: ₦5,000</p>
  <p>Daily Earnings: ₦750</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Maize Plan", 5000, 750, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🫘 Beans Plan</h2>
  <p>Investment: ₦10,000</p>
  <p>Daily Earnings: ₦1,600</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Beans Plan", 10000, 1600, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🥜 Groundnut Plan</h2>
  <p>Investment: ₦30,000</p>
  <p>Daily Earnings: ₦5,100</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Groundnut Plan", 30000, 5100, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🍅 Tomatoes Plan</h2>
  <p>Investment: ₦50,000</p>
  <p>Daily Earnings: ₦9,000</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Tomatoes Plan", 50000, 9000, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🍌 Plantain Plan</h2>
  <p>Investment: ₦80,000</p>
  <p>Daily Earnings: ₦15,200</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Plantain Plan", 80000, 15200, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🌾 Rice Plan</h2>
  <p>Investment: ₦120,000</p>
  <p>Daily Earnings: ₦24,000</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Rice Plan", 120000, 24000, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🌿 Cassava Plan</h2>
  <p>Investment: ₦250,000</p>
  <p>Daily Earnings: ₦55,000</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Cassava Plan", 250000, 55000, 365)}>
    Invest
  </button>
</div>

<div className="investment-card">
  <h2>🍠 Yam Plan</h2>
  <p>Investment: ₦500,000</p>
  <p>Daily Earnings: ₦125,000</p>
  <p>Duration: 365 Days</p>

  <button onClick={() => invest("Yam Plan", 500000, 125000, 365)}>
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