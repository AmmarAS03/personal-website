import React from "react";
import "../assets/scss/Navbar.scss";

function Navbar() {
  return (
    <div className="navbar-container">

        <img src="/images/letter-a.png" className="navbar-logo" />
        <div className="navbar-menu">
            {/* <div className="navbar-home">
                <p className="home-title">Home</p>
            </div> */}
            <div className="navbar-me">
                <p className="me-title">About Me</p>
            </div>
            <div className="navbar-project">
                <p className="home-title">Work Experience</p>
            </div>
            <div className="navbar-connect">
                <p className="home-title">Project</p>
            </div>

      </div>
    </div>
  );
}

export default Navbar;
