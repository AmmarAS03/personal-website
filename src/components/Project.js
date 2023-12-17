import React from 'react'
import "../assets/scss/Project.scss";
import Carousel from './Carousel';

function Project() {
  return (
    <div className='project-container'>
      {/* <img className='background-image-project' src="/images/cat.gif" /> */}
       <div className='hello-heading-1'>Project</div>

      <Carousel/>
    </div>

  )
}

export default Project