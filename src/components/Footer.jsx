import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-section">
          <h2>🌱 HarvestFund</h2>

          <p>
            Invest in agriculture with confidence while helping
            farmers grow across Nigeria.
          </p>
        </div>

        {/* SUPPORT */}
        <div className="footer-section">
          <h3>Support</h3>

          <p>
            📧 Email:
            <a href="mailto:harvestfund109@gmail.com">
              harvestfund109@gmail.com
            </a>
          </p>

          <p>
            💬 Help Center: Coming Soon
          </p>

          <p>
            ✈️ Telegram:
            <a
              href="https://t.me/+m5DOiJmfzH8xYmZk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join our Telegram
            </a>
          </p>
        </div>

        {/* LEGAL */}
        <div className="footer-section">
          <h3>Legal</h3>

          <p>Terms & Conditions</p>

          <p>Privacy Policy</p>
        </div>

      </div>

      <hr />

      <p className="copyright">
        © 2026 HarvestFund. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;