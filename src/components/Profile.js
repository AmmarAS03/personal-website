import React from "react";
import "../assets/scss/Profile.scss";
import { Typewriter } from "react-simple-typewriter";

function Profile() {
  return (
    <div className="profile-container">
      <div className="name-container">
        <div className="upper-container">
          <div className="hello-container">
            <p className="hello-heading-1-profile">Hello Folks!</p>
            <p className="hello-heading-1-profile">I'm Ammar</p>
          </div>
          <div className="text-container">
            <p className="hello-heading-2-profile">
              <Typewriter
                words={[
                  "CompSci Student",
                  "Developer",
                  "Adventurer",
                  "Baller.",
                ]}
                loop={false}
                cursor
                cursorStyle="_"
                typeSpeed={100}
                deleteSpeed={50}
                delaySpeed={1000}
                
              />
            </p>
          </div>
        </div>
      </div>
      <img
        src="/images/Profile.svg" // Update the path based on your project structure
        alt="Profile SVG"
        className="image-container"
      />
    </div>
  );
}

export default Profile;
