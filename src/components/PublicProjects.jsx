import { useNavigate } from "react-router-dom";
import "../styles/Projects.css";

function PublicProjects() {
  const navigate = useNavigate();

  return (
    <section className="public-projects">

      <div className="projects-header">
        <h2>🌱 HarvestFund Investment Opportunities</h2>

        <p>
          Invest in agriculture, grow your wealth, and earn daily
          with HarvestFund.
        </p>
      </div>

      

      {/* CALL TO ACTION */}
      <div className="flyer-action">
        <h2>🌱 Ready to Start Investing?</h2>

        <p>
          Create your HarvestFund account and start your
          investment journey today.
        </p>

        <button
          className="invest-btn"
          onClick={() => navigate("/login")}
        >
          Login to Invest →
        </button>
      </div>

    </section>
  );
}

export default PublicProjects;