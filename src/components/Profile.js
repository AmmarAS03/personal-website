import React from "react";
import styles from "../assets/scss/Profile.module.scss";
import { Typewriter } from "react-simple-typewriter";

function Profile() {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.nameContainer}>
        <div className={styles.upperContainer}>
          <div className={styles.helloContainer}>
            <p className={styles.helloHeading1Profile}>Hello Folks!</p>
            <p className={styles.helloHeading1Profile}>I'm Ammar</p>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.helloHeading2Profile}>
              <Typewriter
                words={[
                  "CompSci Student",
                  "Developer",
                  "Designer",
                  "Adventurer",
                  "Baller",
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
        src="/images/Profile.svg"
        alt="Profile SVG"
        className={styles.imageContainer}
      />
    </div>
  );
}

export default Profile;