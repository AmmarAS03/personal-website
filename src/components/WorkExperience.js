import React from "react";
import "../assets/scss/WorkExperience.scss";

function WorkExperience() {
  return (
    <div className="work-container">
       <img  src="/images/Flower.png" className="background-image-2"/>
      <p className="header-work-1">Work Experience</p>
      <div className="card-container">
        <div className="card-1">
          <div className="image-box-card">
            <div className="title-container">
            <p className="card-title">Full Stack Developer</p>
            <p className="card-company">Naf Karya Indonesia</p>
            </div>

            <a href="https://jesara.co.id/" target="_blank" rel="noopener noreferrer">
            <img src="/images/fullstack.png" className="card-image"/>
            </a>
          </div>
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaamore than just a friend. 
            </p>
          </div>
        </div>
        <div className="card-2">
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
          <div className="image-box-card">
          <div className="title-container">
            <p className="card-title">Network Engineer</p>
            <p className="card-company">Netsistem Infotama</p>
            </div>

            <a href="https://www.netsistem.co.id/" target="_blank" rel="noopener noreferrer">
            <img src="/images/Network.png" className="card-image" />
            </a>
          </div>
        </div>

        <div className="card-1">
          <div className="image-box-card">
          <div className="title-container">
            <p className="card-title">Teaching Assistant</p>
            <p className="card-company">Faculty of Computer Science UI</p>
            </div>
            <a href="https://cs.ui.ac.id/" target="_blank" rel="noopener noreferrer">
            <img src="/images/TA.png" className="card-image" />
            </a>

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

        <div className="card-2">
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              all i ask is if this is my last night with you, hold me like im
              more than just a friend. lets make a memory i can use. uuuuuuu
              yeeaa adele lets go mbaaa
            </p>
          </div>
          <div className="image-box-card">
          <div className="title-container">
            <p className="card-title">Python Mentor</p>
            <p className="card-company">Dasar-dasar Pemrograman 0</p>
            </div>

            <a href="https://www.linkedin.com/company/ddp0fasilkomui/about/" target="_blank" rel="noopener noreferrer">
            <img src="/images/mentor.png" className="card-image" />
            </a>

          </div>
        </div>
        {/* <img src="/images/box.png" className="card-image-2" /> */}
      </div>
    </div>
  );
}

export default WorkExperience;
