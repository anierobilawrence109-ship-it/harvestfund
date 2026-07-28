import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* HERO CONTENT */}
      <div className="hero-content">

        {/* BADGE */}
        <div className="hero-badge">
          🌱 AGRICULTURE • INVESTMENT • GROWTH
        </div>

        {/* HEADING */}
        <h1>
          Invest in Agriculture,
          <span>Grow Your Wealth.</span>
        </h1>

        {/* DESCRIPTION */}
        <p>
          Invest in carefully selected agricultural projects
          across Nigeria and earn competitive returns while
          supporting the growth of local farmers.
        </p>

        {/* BUTTONS */}
        <div className="hero-buttons">

          <button
            className="hero-primary-btn"
            onClick={() => navigate("/login")}
          >
            Start Investing
            <span>→</span>
          </button>

          <button
            className="hero-secondary-btn"
            onClick={() => {
              const projectsSection =
                document.querySelector(".projects");

              if (projectsSection) {
                projectsSection.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
          >
            View Investment Plans
          </button>

        </div>

        {/* TRUST SECTION */}
        <div className="hero-trust">

          <div className="trust-item">
            <strong>🌾</strong>

            <span>
              Agriculture
              <small>Real Projects</small>
            </span>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <strong>🔒</strong>

            <span>
              Secure
              <small>Investment Platform</small>
            </span>
          </div>

          <div className="trust-divider"></div>

          <div className="trust-item">
            <strong>📈</strong>

            <span>
              Growth
              <small>Competitive Returns</small>
            </span>
          </div>

        </div>

      </div>

      {/* HERO VISUAL */}
      <div className="hero-visual">

        <div className="hero-circle"></div>

        <div className="plant-illustration">
          🌱
        </div>

        {/* FLOATING CARD ONE */}
        <div className="floating-card card-one">

          <span>🌾</span>

          <div>
            <strong>Growing Together</strong>
            <small>Supporting Nigerian Farmers</small>
          </div>

        </div>

        {/* FLOATING CARD TWO */}
        <div className="floating-card card-two">

          <span>📈</span>

          <div>
            <strong>Invest & Grow</strong>
            <small>Build Your Financial Future</small>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;