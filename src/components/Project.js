import React from 'react'
import styles from "../assets/scss/Project.module.scss";
import Carousel from './Carousel';

function Project() {
  return (
    <div className={styles.projectContainer}>
      {/* <img className='background-image-project' src="/images/cat.gif" /> */}
       <div className={styles.helloHeading1}>Project</div>

      <Carousel/>
    </div>

  )
}

export default Project