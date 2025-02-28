import React from "react";
import styles from "../assets/scss/Footer.module.scss";

function Footer() {
  const handleDownloadClick = () => {
    // Replace '/path/to/your/file.pdf' with the actual path to your PDF file
    const pdfUrl = "/file/AmmarAshShiddiq_CV.pdf";

    // Open a new tab with the PDF file
    window.open(pdfUrl, "_blank");
  };
  return (
    <div className={styles.footerContainer}>
      {/* <img src="/images/letter-a.png" className={styles.footerLogo} /> */}
      <div className={styles.footerCopyrightContainer}>
        <div className={styles.footerCopyright}>
          {/* <img src="/images/copyright.png" className={styles.copyrightLogo} alt="" />{" "} */}
          2023 Ammar Ash Shiddiq. All Right Reserved.
        </div>
        <div className={styles.footerCopyright}>
          Created with love and passion by Ammar Ash Shiddiq
        </div>
      </div>

      <div className={styles.footerDownload}>
        <div className={styles.footerHome} onClick={handleDownloadClick}>
          <img
            className={styles.footerLogoDownload}
            src="/images/downloads.png"
            alt=""
          />
          <p className={styles.footerTitle}>Download CV</p>
        </div>
      </div>

      <div className={styles.footerMenu}>
        <a
          href="https://www.instagram.com/ammarshddq/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.footerLogo} src="/images/instagram.png" alt="" />
        </a>

        <a
          href="https://www.linkedin.com/in/ammar-ash-shiddiq-b0b00a212/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.footerLogo} src="/images/linkedin.png" alt="" />
        </a>

        <a
          href="mailto:Ammarashshiddiq2@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.footerLogo} src="/images/gmail.png" alt="" />
        </a>

        <a
          href="https://github.com/AmmarAS03"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className={styles.footerLogo} src="/images/github.png" alt="" />
        </a>
      </div>
    </div>
  );
}

export default Footer;