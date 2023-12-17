import React from "react";
import "../assets/scss/Footer.scss";

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-copyright-container">
      <div className="footer-copyright">2023 Ammar Ash Shiddiq. All right Reserved.</div>
      <div className="footer-copyright">Created with love and passion by Ammar Ash Shiddiq</div>
      </div>


        <img src="/images/letter-a.png" className="footer-logo" />
        <div className="footer-menu">
            <div className="footer-home">
                <p className="footer-title">Home</p>
            </div>

      </div>
    </div>
  );
}

export default Footer;
