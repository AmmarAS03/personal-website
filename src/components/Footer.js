import React from "react";
import "../assets/scss/Footer.scss";

function Footer() {
  const handleDownloadClick = () => {
    // Replace '/path/to/your/file.pdf' with the actual path to your PDF file
    const pdfUrl = '/file/AmmarAshShiddiq_CV.pdf';

    // Open a new tab with the PDF file
    window.open(pdfUrl, '_blank');
  };
  return (
    <div className="footer-container">

        {/* <img src="/images/letter-a.png" className="footer-logo" /> */}
      <div className="footer-copyright-container">
        <div className="footer-copyright"><img src='/images/copyright.png' className="copyright-logo" alt=""/> 2023 Ammar Ash Shiddiq. All Right Reserved.</div>
        <div className="footer-copyright">Created with love and passion by Ammar Ash Shiddiq</div>
      </div>

      <div className="footer-download">
      <div className="footer-home" onClick={handleDownloadClick}>
        <img className="footer-logo-download" src="/images/downloads.png" alt=""/>
        <p className="footer-title">Download CV</p>
      </div>
      </div>
        <div className="footer-menu">
          <a href="https://www.instagram.com/ammarshddq/" target="_blank" rel="noopener noreferrer" >
          <img className="footer-logo" src="/images/instagram.png" alt=""/>
          </a>

          <a href="https://www.linkedin.com/in/ammar-ash-shiddiq-b0b00a212/" target="_blank" rel="noopener noreferrer">
          <img className="footer-logo" src="/images/linkedin.png" alt=""/>
          </a>

          <a href="mailto:Ammarashshiddiq2@gmail.com" target="_blank" rel="noopener noreferrer">
          <img className="footer-logo" src="/images/gmail.png" alt=""/>
          </a>

          
          <a href="https://github.com/AmmarAS03" target="_blank" rel="noopener noreferrer">
          <img className="footer-logo" src="/images/github.png" alt=""/>
          </a>
            {/* <div className="footer-home">
                <p className="footer-title">Home</p>
            </div> */}

      </div>
    </div>
  );
}

export default Footer;
