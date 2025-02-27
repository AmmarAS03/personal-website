import React from "react";
import styles from "../assets/scss/Work.module.scss";

function Work() {
  return (
    <div className={styles.workContainer}>
      <img
        src="/images/Flower.png"
        className={styles.backgroundImage2}
        alt=""
      />
      <p className={styles.headerWork1}>Work Experience</p>
      <div className={styles.cardContainer}>
        <div className={styles.leftSide}>
          <div className={styles.buttonContainer}>
            <p>test</p>
          </div>
          <div className={styles.buttonContainer}>
            <p>test</p>
          </div>
          <div className={styles.buttonContainer}>
            <p>test</p>
          </div>
          <div className={styles.buttonContainer}>
            <p>test</p>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.boxHeader}>
            <div className={styles.leftBar}>Description</div>
            <div className={styles.rightBar}>Project</div>
          </div>
          <div className={styles.boxBody}>
            this is the text
          </div>
        </div>

        {/* <img src="/images/box.png" className={styles.cardImage2} /> */}
      </div>
    </div>
  );
}

export default Work;
