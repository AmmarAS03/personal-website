import React from "react";
import styles from "../assets/scss/Work.module.scss";

function Work() {
  return (
    <div className={styles.workContainer}>
      <img src="/images/Flower.png" className={styles.backgroundImage2} alt=""/>
      <p className={styles.headerWork1}>Work Experience</p>
      <div className={styles.cardContainer}>
        <div className={styles.card1}>
          <div className={styles.imageBoxCard}>
            <div className={styles.titleContainer}>
              <p className={styles.cardTitle}>Full Stack Developer</p>
              <p className={styles.cardCompany}>Naf Karya Indonesia</p>
            </div>

            <a href="https://jesara.co.id/" target="_blank" rel="noopener noreferrer">
              <img src="/images/fullstack.png" className={styles.cardImage} alt=""/>
            </a>
          </div>
          <div className={styles.textBoxCard}>
            <p className={styles.dateTitle}>Sept 2023 – Nov 2023</p>
            <p className={styles.paragraphText}>
              As a remote intern, I played a key role in developing Jesara Koin, focusing on the back-end using NodeJS, MySQL, and PassportJS, while also handled front-end tasks in accordance with the BRD.
            </p>
          </div>
        </div>
      
        {/* <img src="/images/box.png" className={styles.cardImage2} /> */}
      </div>
    </div>
  );
}

export default Work;