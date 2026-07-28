import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import "../styles/Projects.css";

function Projects({ publicPage = false }) {
  const { invest } = useContext(WalletContext);
  const navigate = useNavigate();

  const projects = [
    {
      name: "🌾 Rice Plan",
      planName: "Rice Plan",
      amount: 4000,
      earnings: 500,
      duration: "60 Days",
      status: "Active",
    },
    {
      name: "🫘 Beans Plan",
      planName: "Beans Plan",
      amount: 8000,
      earnings: 1000,
      duration: "60 Days",
      status: "Active",
    },
    {
      name: "🍌 Plantain Plan",
      planName: "Plantain Plan",
      amount: 16000,
      earnings: 2000,
      duration: "60 Days",
      status: "Active",
    },
    {
      name: "🌽 Maize Plan",
      planName: "Maize Plan",
      amount: 32000,
      earnings: 4000,
      duration: "60 Days",
      status: "Active",
    },

    {
      name: "🌿 Cassava Plan",
      amount: 64000,
      earnings: 8000,
      duration: "90 Days",
      status: "Coming Soon",
    },
    {
      name: "🍅 Tomatoes Plan",
      amount: 128000,
      earnings: 16000,
      duration: "180 Days",
      status: "Coming Soon",
    },
    {
      name: "🥜 Groundnut Plan",
      amount: 256000,
      earnings: 32000,
      duration: "180 Days",
      status: "Coming Soon",
    },
    {
      name: "🍠 Yam Plan",
      amount: 512000,
      earnings: 64000,
      duration: "180 Days",
      status: "Coming Soon",
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