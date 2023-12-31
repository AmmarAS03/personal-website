import React, { useState, useEffect } from "react";
import "../assets/scss/AboutMe.scss";

function AboutMe() {
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const getDescriptionById = (id) => {
    const selectedData = data.find((item) => item.id === id);
    return selectedData ?    <p className="body-1" dangerouslySetInnerHTML={{ __html: selectedData.description }} /> : null;
  };

  const getImageById = (id) => {
    const selectedData = data.find((item) => item.id === id);
    return selectedData ? <img className="image-container-me" src={selectedData.img} alt={`Profile ${id}`} /> : null;
  };

  useEffect(() => {

    getDescriptionById(selectedButton);
    getImageById(selectedButton);


    const intervalId = setInterval(() => {
      const nextId = selectedButton % data.length + 1;
      handleButtonClick(nextId);
    }, 20000);


    return () => clearInterval(intervalId);
  }, [selectedButton]);

  return (
    <div className="about-me-container">
      <img src="/images/Sun.png" className="background-image" alt="" />

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
                style={{ backgroundColor: selectedButton === item.id ? "#017F7E" : "" }}
                onClick={() => handleButtonClick(item.id)}
              />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-menu">
        <a
          href="https://www.instagram.com/ammarshddq/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="footer-logo" src="/images/instagram.png" alt="" />
        </a>

        <a
          href="https://www.linkedin.com/in/ammar-ash-shiddiq-b0b00a212/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="footer-logo" src="/images/linkedin.png" alt="" />
        </a>

        <a
          href="mailto:Ammarashshiddiq2@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="footer-logo" src="/images/gmail.png" alt="" />
        </a>

        <a
          href="https://github.com/AmmarAS03"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="footer-logo" src="/images/github.png" alt="" />
        </a>
      </div>
    </div>
  );
}

const data = [
  {
    id: 1,
    img: "/images/ui.png",
    description: "Hello everyone, <br /> I'm Ammar Ash Shiddiq. I am a passionate and highly motivated computer science student at Universitas Indonesia, where I have gained extensive knowledge and insights in various fields of computer science. <br />   <br /> I'm going to bring you to my learning journey over the years so we can get to know each other!",
  },
  {
    id: 2,
    img: "/images/people.png",
    description: "In Universitas Indonesia, I met so many amazing beautiful people. The CompSci students here embraced a strong hustle culture where there seemed to be no rest days. <br /> <br />  Despite the heavy assignment load and demanding environment, the constant push to work harder has contributed significantly to my personal growth, and for that, I am truly grateful. ",
  },
  {
    id: 3,
    img: "/images/basket.png",
    description: "I use basketball to expand my network and joined the university basketball team. Through this experience, I met exceptional individuals who excelled at maintaining a healthy work-life balance. <br /> <br /> Learning from them, I adopted effective time management skills as a student-athlete. I also participated in nationwide competitions among universities.",
  },
  {
    id: 4,
    img: "/images/mentee.png",
    description: "As I realized my time at UI was limited, I took on the role of a mentor for new students, offering support and guidance to help them navigate the challenges of college life. <br /> <br /> The photo on the right captures a special moment with my lovely mentees, highlighting the meaningful connections through mentorship. ",
  },
  {
    id: 5,
    img: "/images/gunung.png",
    description: "Outdoor activities is also a huge part of my life. In my daily routine, I often encounter things that are only 30cm away from my eyes. However, the beauty of nature allows us to appreciate the beauty of the world around us.<br /> <br /> The photo on the right captures a memorable moment at the summit of Mount Rinjani, the most challenging mountain I've conquered.",
  },
  {
    id: 6,
    img: "/images/gunung2.png",
    description: "Hiking has become an addiction for me, and conquering Mount Fuji stands out as my proudest achievement. The journey was tough, cold, and long, but my determination didn't give in until I reached the summit. <br /> <br /> Everest, 🫵🏼 you're next on my list.",
  },
  {
    id: 7,
    img: "/images/bali.png",
    description: "I also have a passion for meeting new people and spontaneous journeys. On the right is a picture of my new friends from a trip to Bali where I had no solid plans—just booked a hostel and went for it. I ended up spending half the week exploring Bali with them.  <br /> <br /> I think that's all from me for now, please don't hesitate to contact me anytime, Cheers!",
  },
];

export default AboutMe;
