import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "../styles/Projects.css";

function Projects({ publicPage = false }) {
  const { invest } = useContext(WalletContext);
  const navigate = useNavigate();

  const projects = [
  {
    name: "🌽 Maize Plan",
    planName: "Maize Plan",
    amount: 5000,
    earnings: 750,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🫘 Beans Plan",
    planName: "Beans Plan",
    amount: 10000,
    earnings: 1600,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🥜 Groundnut Plan",
    planName: "Groundnut Plan",
    amount: 30000,
    earnings: 5100,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🍅 Tomatoes Plan",
    planName: "Tomatoes Plan",
    amount: 50000,
    earnings: 9000,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🍌 Plantain Plan",
    planName: "Plantain Plan",
    amount: 80000,
    earnings: 15200,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🌾 Rice Plan",
    planName: "Rice Plan",
    amount: 120000,
    earnings: 24000,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🌿 Cassava Plan",
    planName: "Cassava Plan",
    amount: 250000,
    earnings: 55000,
    duration: "365 Days",
    status: "Active",
  },
  {
    name: "🍠 Yam Plan",
    planName: "Yam Plan",
    amount: 500000,
    earnings: 125000,
    duration: "365 Days",
    status: "Active",
  },
];

  // ==========================================
  // HANDLE INVEST BUTTON
  // ==========================================
  const handleInvest = (project) => {
    // PUBLIC HOME PAGE
    // Send visitor to login
    if (publicPage) {
      navigate("/login");
      return;
    }

    // DASHBOARD
    // Allow logged-in user to invest normally
    invest(project.planName);
  };

  return (
    <section className="projects">
      <h2>🌱 Investment Plans</h2>

      <p className="projects-subtitle">
        Choose an agricultural investment plan and grow
        with HarvestFund.
      </p>

      <div className="projects-container">
        {projects.map((project, index) => (
          <div
            className={`project-card ${
              project.status === "Coming Soon"
                ? "coming-soon-card"
                : ""
            }`}
            key={index}
          >
            {/* STATUS */}
            <span
              className={`project-status ${
                project.status === "Active"
                  ? "active-status"
                  : "coming-status"
              }`}
            >
              {project.status === "Active"
                ? "● Active"
                : "Coming Soon"}
            </span>

            <h3>{project.name}</h3>

            <p>
              <strong>Investment:</strong>{" "}
              ₦{project.amount.toLocaleString()}
            </p>

            <p>
              <strong>Daily Earnings:</strong>{" "}
              ₦{project.earnings.toLocaleString()}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {project.duration}
            </p>

           {project.status === "Active" ? (
 <button
  className="invest-btn"
  onClick={() => handleInvest(project)}
>
  Invest Now
</button>
) : (
              <button
                className="invest-btn coming-soon-btn"
                disabled
              >
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;