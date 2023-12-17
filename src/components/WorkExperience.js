import React from "react";
import "../assets/scss/WorkExperience.scss";

function WorkExperience() {
  return (
    <div className="work-container">
       <img  src="/images/Flower.png" className="background-image-2" alt=""/>
      <p className="header-work-1">Work Experience</p>
      <div className="card-container">
        <div className="card-1">
          <div className="image-box-card">
            <div className="title-container">
            <p className="card-title">Full Stack Developer</p>
            <p className="card-company">Naf Karya Indonesia</p>
            </div>

            <a href="https://jesara.co.id/" target="_blank" rel="noopener noreferrer">
            <img src="/images/fullstack.png" className="card-image" alt=""/>
            </a>
          </div>
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
            As a remote intern, I played a key role in developing Jesara Koin, focusing on the back-end using NodeJS, MySQL, and PassportJS, while also handled front-end tasks in accordance with the BRD.
            </p>
          </div>
        </div>
        <div className="card-2">
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
            Netsistem is a government-focused outsourcing company. I have the chance to work with BIN, where I learned valuable understanding about 7-layer OSI which strengthen my computer science foundation.
            </p>
          </div>
          <div className="image-box-card">
          <div className="title-container">
            <p className="card-title">Network Engineer</p>
            <p className="card-company">Netsistem Infotama</p>
            </div>

            <a href="https://www.netsistem.co.id/" target="_blank" rel="noopener noreferrer">
            <img src="/images/Network.png" className="card-image" alt=""/>
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
            <img src="/images/TA.png" className="card-image" alt="" />
            </a>

          </div>
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
            As a Teaching Assistant for Foundation of Programming 2 (Java), I mentored 8 students over 4 months. I conducted lab sessions, assisting in understanding programming concepts and their Java assignments.
            </p>
          </div>
        </div>

        <div className="card-2">
          <div className="text-box-card">
            <p className="date-title">Sept 2023 – Nov 2023</p>
            <p className="paragraph-text">
              Also known as DDP-0, is a yearly event with a purpose to introduce the fundamentals of programming using Python. I guided 4 new faculty students by providing them mentoring, evaluations, and consultations.
            </p>
          </div>
          <div className="image-box-card">
          <div className="title-container">
            <p className="card-title">Python Mentor</p>
            <p className="card-company">Dasar-dasar Pemrograman 0</p>
            </div>

            <a href="https://www.linkedin.com/company/ddp0fasilkomui/about/" target="_blank" rel="noopener noreferrer">
            <img src="/images/mentor.png" className="card-image" alt="" />
            </a>

          </div>
        </div>
        {/* <img src="/images/box.png" className="card-image-2" /> */}
      </div>
    </div>
  );
}

export default WorkExperience;
