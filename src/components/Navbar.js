import React from "react";
import "../assets/scss/Navbar.scss";

function Navbar() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="navbar-container">

        <img src="/images/letter-a.png" className="navbar-logo" alt="" />
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
    </div>
  );
}

export default Navbar;
