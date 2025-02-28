import React, { useState } from "react";
import styles from "../assets/scss/Work.module.scss";

function Work() {
  // Updated work experience data with project images
  const workExperiences = [
    {
      id: 1,
      title: "Web Developer",
      company: "Newish Communications",
      period: "Jan 2025 - Present",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra justo eu velit bibendum, at volutpat nibh pulvinar. Maecenas consectetur nisi vitae lacus finibus, vel tincidunt erat finibus. Suspendisse potenti. Donec congue, nisl non efficitur hendrerit.",
      project: "Developed a responsive web application using React and Node.js. Implemented user authentication, data visualization, and real-time updates. Collaborated with a team of 5 developers using agile methodologies.",
      projectImage: "/images/Flower.png" // Add your image path here
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "Techflouu",
      period: " Feb 2024 - Present",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra justo eu velit bibendum, at volutpat nibh pulvinar. Maecenas consectetur nisi vitae lacus finibus, vel tincidunt erat finibus. Suspendisse potenti. Donec congue, nisl non efficitur hendrerit.",
      project: "Developed a responsive web application using React and Node.js. Implemented user authentication, data visualization, and real-time updates. Collaborated with a team of 5 developers using agile methodologies.",
      projectImage: "/images/Flower.png" // Add your image path here
    },
    {
      id: 3,
      title: "Full Stack Developer Intern",
      company: "Naf Karya Indonesia",
      period: "Sept 2023 – Nov 2023",
      description: "As a remote intern, I played a key role in developing Jesara Koin, focusing on the back-end using NodeJS, MySQL, and PassportJS, while also handled front-end tasks in accordance with the BRD.",
      project: "Redesigned the company's flagship product, improving user satisfaction by 35%. Created wireframes, prototypes, and conducted user testing with over 50 participants. Implemented design system for consistent UI components.",
      projectImage: "/images/Flower.png" // Add your image path here
    },
    {
      id: 4,
      title: "Network Engineer Intern",
      company: "Netsistem Infotama",
      period: "Apr 2023 – June 2023",
      description: "Netsistem is a government-focused outsourcing company. I have the chance to work with BIN, where I learned valuable understanding about 7-layer OSI which strengthen my computer science foundation.",
      project: "I involved in a porject that handles the networking of govenment selection"
      // No projectImage for this one to demonstrate both with and without images
    },
    {
      id: 5,
      title: "Teaching Assistant",
      company: "Faculty of Computer Science UI",
      period: "Jan 2023 – June 2023",
      description: "As a Teaching Assistant for Foundation of Programming 2 (Java), I mentored 8 students over 4 months. I conducted lab sessions, assisting in understanding programming concepts and their Java assignments.",
      project: "Led product development for a mobile application with over 100,000 users. Coordinated cross-functional teams and managed release cycles. Conducted market research to identify new feature opportunities."
    },
    {
      id: 6,
      title: "Python Mentor",
      company: "Dasar-dasar Pemrograman 0",
      period: "July 2022 - August 2022",
      description: "As a Teaching Assistant for Foundation of Programming 2 (Java), I mentored 8 students over 4 months. I conducted lab sessions, assisting in understanding programming concepts and their Java assignments.",
      project: "Led product development for a mobile application with over 100,000 users. Coordinated cross-functional teams and managed release cycles. Conducted market research to identify new feature opportunities."
    }
  ];

  // State to track selected experience and view
  const [selectedExp, setSelectedExp] = useState(1);
  const [activeView, setActiveView] = useState('description'); // 'description' or 'project'

  // Find the currently selected experience
  const currentExperience = workExperiences.find(exp => exp.id === selectedExp);

  // Render content based on whether there's a project image or not
  const renderContent = () => {
    if (activeView === 'description') {
      return (
        <p className={styles.contentText}>
          {currentExperience.description}
        </p>
      );
    } else {
      // Check if there's a project image
      if (currentExperience.projectImage) {
        return (
          <div className={styles.projectWithImage}>
            <div className={styles.projectImageContainer}>
              <img 
                src={currentExperience.projectImage} 
                alt={`${currentExperience.title} project`} 
                className={styles.projectImage}
              />
            </div>
            <div className={styles.projectTextContainer}>
              <p className={styles.contentText}>
                {currentExperience.project}
              </p>
            </div>
          </div>
          
        );
      } else {
        return (
          <p className={styles.contentText}>
            {currentExperience.project}
          </p>
        );
      }
    }
  };

  return (
    <div className={styles.workContainer}>
      <img src="/images/Flower.png" className={styles.backgroundImage2} alt="" />
      <p className={styles.headerWork1}>Work Experience</p>
      
      <div className={styles.cardContainer}>
        <div className={styles.leftSide}>
          {workExperiences.map((exp) => (
            <div 
              key={exp.id}
              className={`${styles.buttonContainer} ${selectedExp === exp.id ? styles.buttonActive : ''}`}
              onClick={() => setSelectedExp(exp.id)}
            >
              <div className={styles.buttonContent}>
                <p className={styles.expTitle}>{exp.title}</p>
                <p className={styles.expCompany}>{exp.company}</p>
                <p className={styles.expPeriod}>{exp.period}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.rightSide}>
          <div className={styles.boxHeader}>
            <div 
              className={`${styles.leftBar} ${activeView === 'description' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('description')}
            >
              Description
            </div>
            <div 
              className={`${styles.rightBar} ${activeView === 'project' ? styles.activeTab : ''}`}
              onClick={() => setActiveView('project')}
            >
              Project
            </div>
          </div>
          
          <div className={styles.boxBody}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Work;