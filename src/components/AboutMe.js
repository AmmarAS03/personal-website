import React from "react";
import "../assets/scss/AboutMe.scss";
function AboutMe() {
  return (
    <div className="about-me-container">
    <img  src="/images/Sun.png" className="background-image"/>

      <p className="hello-heading-1-about-me">About Me</p>
      <div className="box">
        <div className="left-box">
          <div className="left-fill">
            <p className="body-1">
              I’m an explorer, I like to explore new things, I love outdoor
              activities
            </p>
          </div>
        </div>

        <div className="right-box">
          <div className="right-fill">
            <img
              src="/images/gunung.jpg" // Update the path based on your project structure
              alt="Profile SVG"
              className="image-container-me"
            />
            <div className="button-container-me">
                <div className="button-me"/>
                <div className="button-me"/>
                <div className="button-me"/>
                <div className="button-me"/>
                <div className="button-me"/>
                <div className="button-me"/>
                <div className="button-me"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
