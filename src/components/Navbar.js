// Updated Navbar.jsx
import React, { useState } from "react";
import "../assets/scss/Navbar.scss";

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
    <div className={`navbar-container ${menuOpen ? 'menu-open' : ''}`}>
      <img src="/images/letter-a.png" className="navbar-logo" alt="" />
      
      {/* Hamburger Menu Icon */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Regular Menu (visible on desktop) */}
      <div className="navbar-menu">
        <div className="navbar-me" onClick={() => scrollToSection("about-me-section")}>
          <p className="me-title">About Me</p>
        </div>
        <div className="navbar-project" onClick={() => scrollToSection("work-experience-section")}>
          <p className="home-title">Work Experience</p>
        </div>
        <div className="navbar-connect" onClick={() => scrollToSection("project-section")}>
          <p className="home-title">Project</p>
        </div>
      </div>

      {/* Mobile Menu (toggled by hamburger) */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-item" onClick={() => scrollToSection("about-me-section")}>
          <p>About Me</p>
        </div>
        <div className="mobile-menu-item" onClick={() => scrollToSection("work-experience-section")}>
          <p>Work Experience</p>
        </div>
        <div className="mobile-menu-item" onClick={() => scrollToSection("project-section")}>
          <p>Project</p>
        </div>
      </div>
    </div>
  );
}

export default Navbar;