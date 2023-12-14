import React from "react";
import "../assets/scss/WorkExperience.scss";

function WorkExperience() {
  return (
    <div className="work-container">
      <p className="header-work-1">Work Experience</p>
      <div className="card-container">
        <div className="card-1">
          <div className="image-box-card">
            <p className="card-title">Fullstack Developer</p>
            <img src="/images/fullstack.png" className="card-image" />
          </div>
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
        </div>
        <div className="card-1">
        <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
          <div className="image-box-card">
            <p className="card-title">Network Engineer</p>
            <img src="/images/Network.png" className="card-image" />
          </div>
        </div>

        <div className="card-1">
          <div className="image-box-card">
            <p className="card-title">Teaching Assistant</p>
            <img src="/images/TA.png" className="card-image" />
          </div>
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
        </div>

        <div className="card-1">
        <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
          <div className="image-box-card">
            <p className="card-title">Python Menthor</p>
            <img src="/images/mentor.png" className="card-image" />
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default WorkExperience;
