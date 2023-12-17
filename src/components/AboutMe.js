import React, { useState, useEffect } from "react";
import "../assets/scss/AboutMe.scss";

function AboutMe() {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const getDescriptionById = (id) => {
    const selectedData = data.find((item) => item.id === id);
    console.log(selectedData)
    return selectedData ? (
      <>
        <p className="body-1">{selectedData.description}</p>
      </>
    ) : null;
  };


  const getImageById = (id) => {
    const selectedData = data.find((item) => item.id === id);
    console.log(selectedData)
    return selectedData ? (
      <>
        <img className="image-container-me" src={selectedData.img}/>
      </>
    ) : null;
  };

  useEffect(() => {
    // Initialize the content to be based on id equal to 1
    getDescriptionById(1);
    getImageById(1);
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div className="about-me-container">
      <img src="/images/Sun.png" className="background-image" />

      <p className="hello-heading-1-about-me">About Me</p>
      <div className="box">
        <div className="left-box">
          <div className="left-fill">
            {getDescriptionById(selectedButton)}
          </div>
        </div>

        <div className="right-box">
          <div className="right-fill">
            {getImageById(selectedButton)}
            {/* <img src="/images/gunung.jpg" className="image-container-me"/> */}
            <div className="button-container-me">
              {data.map((item) => (
                <div
                  key={item.id}
                  className={`button-me ${selectedButton === item.id ? "active" : ""}`}
                  onClick={() => handleButtonClick(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const data = [
  {
    id: 1,
    img: "/images/ui.png",
    description: "Hello everyone, saya akan membawa ... journey saya",
  },
  {
    id: 2,
    img: "/images/people.png",
    description: "dimana saya ketemu banyak beautiful people that ",
  },
  {
    id: 3,
    img: "/images/gunung.png",
    description: "Saya menggunakan basket sebagai to expand my network",
  },
  {
    id: 4,
    img: "/images/gunung2.png",
    description: "Gunung pun menjadi sebuah adiksi",
  },
];

export default AboutMe;
