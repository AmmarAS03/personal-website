import React, { useState } from "react";
import "../assets/scss/Project.scss";

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };
  
    const calculateIndex = (offset) => (currentIndex + offset + data.length) % data.length;
  
    const slicedData =
      data.length >= 3
        ? [calculateIndex(0), calculateIndex(1), calculateIndex(2)].map((index) => data[index])
        : [...data.slice(currentIndex), ...data.slice(0, Math.max(0, 3 - data.length))];
  

  return (
    <div className="carousel-container">
      <div className="card-project-container">
        <img
          src="/images/left-arrow.png"
          className="arrow"
          onClick={handlePrev}
        />
        {slicedData.map((d) => (
           <div key={d.id} className="card-project-1">
            <img className="project-image" src={d.img} alt={d.name} />

            <div className="bottom-container">
              <div className="vector-project" />
              <div className="project-text-container">
                <p className="project-title">{d.name}</p>
                <p className="project-paragraph">{d.description}</p>
              </div>
            </div>
          </div>
        ))}
        <img
          src="/images/right-arrow.png"
          className="arrow"
          onClick={handleNext}
        />
      </div>
    </div>
  );
}

const data = [
  {
    id: 1,
    name: `Siasisten`,
    img: `/images/Siasisten.png`,
    description: `Siasisten is a web app that efficiently manages teaching assistant related works for admin, finance, lecturers, and students. made with Python REST and reactJS.`,
  },
  {
    id: 2,
    name: `Digipets`,
    img: `/images/digipets.png`,
    description: `A digital pets application where you can find, raise, and cuztomized your pets. I handled Micro-transactions module using Bootstrap. `,
  },
  {
    id: 3,
    name: `ACB-ISBE`,
    img: `/images/acb.png`,
    description: `A web conference app with 1600+ data about paper, journals, etc. Redesigned the web and mobile app using Django and Flutter. `,
  },
  {
    id: 4,
    name: `EAN-13`,
    img: `/images/ean-13.png`,
    description: `Barcode generator that automates the creation of the 13th number. Created using Python. `,
  },
  {
    id: 5,
    name: `Gotong Ruang`,
    img: `/images/gotongruang.png`,
    description: `A community based platform for users to discover and participate in various volunteer activities. made with NodeJS and ReactJS `,
  },
  {
    id: 6,
    name: `Fine-Later`,
    img: `/images/fine-later.png`,
    description: `Fine Later is a prototype to help scientist gather data to handle the low quality for pediatrics medicine. Ensuring easiness, privacy, and quality. Build with NodeJS. `,
  },
  {
    id: 7,
    name: `Blazer's Analysis`,
    img: `/images/portland.png`,
    description: `A data analysis project, extracting real-time 1000+ data  through web scraping. Applying machine learning algorithms to analyze and evaluate performance. `,
  },
];

export default Carousel;
