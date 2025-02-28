// Navbar.jsx with CSS Modules
import React, { useState } from "react";
import styles from "../assets/scss/Navbar.module.scss";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Close menu after clicking
    }
  };

  return (
    <div className={`${styles.navbarContainer} ${menuOpen ? styles.menuOpen : ''}`}>
      <img src="/images/letter-a.png" className={styles.navbarLogo} alt="" />
      
      {/* Hamburger Menu Icon */}
      <div className={styles.hamburgerIcon} onClick={toggleMenu}>
        <div className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></div>
        <div className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></div>
        <div className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ''}`}></div>
      </div>

      {/* Regular Menu (visible on desktop) */}
      <div className={styles.navbarMenu}>
        <div className={styles.navbarMe} onClick={() => scrollToSection("about-me-section")}>
          <p className={styles.meTitle}>About Me</p>
        </div>
        <div className={styles.navbarProject} onClick={() => scrollToSection("work-experience-section")}>
          <p className={styles.homeTitle}>Work Experience</p>
        </div>
        <div className={styles.navbarConnect} onClick={() => scrollToSection("project-section")}>
          <p className={styles.homeTitle}>Project</p>
        </div>
      </div>

      {/* Mobile Menu (toggled by hamburger) */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuItem} onClick={() => scrollToSection("about-me-section")}>
          <p>About Me</p>
        </div>
        <div className={styles.mobileMenuItem} onClick={() => scrollToSection("work-experience-section")}>
          <p>Work Experience</p>
        </div>
        <div className={styles.mobileMenuItem} onClick={() => scrollToSection("project-section")}>
          <p>Project</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;