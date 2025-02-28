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
          <div className={styles.helloContainer2}>
            <p className={styles.helloHeading3Profile}>I'm a final year double degree student in</p>
            <p className={styles.helloHeading3Profile}>Computer Science and Information Technology.</p>
            <p className={styles.helloHeading3Profile}>I'm more than that, I'm a...</p>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.helloHeading2Profile}>
              <Typewriter
                words={[
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
      {/* <img
        src="/images/Profile.svg"
        alt="Profile SVG"
        className={styles.imageContainer}
      /> */}
            <div className={styles.layeredImageContainer}>
        <div className={`${styles.photoFrame} ${styles.frame4}`}></div>
        <div className={`${styles.photoFrame} ${styles.frame3}`}></div>
        <div className={`${styles.photoFrame} ${styles.frame2}`}></div>
        <div className={`${styles.photoFrame} ${styles.frame1}`}>
          <img src="/images/Profile.JPG" alt="Ammar's photo" className={styles.actualPhoto} />
        </div>
      </div>
    </div>
  );
}

export default Profile;