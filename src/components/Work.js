import React, { useState } from "react";
import styles from "../assets/scss/Work.module.scss";

function Work() {
  // Sample work experience data
  const workExperiences = [
    {
      id: 1,
      title: "Software Engineer",
      company: "Techflouu",
      period: "2022 - 2023",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam viverra justo eu velit bibendum, at volutpat nibh pulvinar. Maecenas consectetur nisi vitae lacus finibus, vel tincidunt erat finibus. Suspendisse potenti. Donec congue, nisl non efficitur hendrerit.",
      project: "Developed a responsive web application using React and Node.js. Implemented user authentication, data visualization, and real-time updates. Collaborated with a team of 5 developers using agile methodologies."
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "Naf Karya Indonesia",
      period: "2021 - 2022",
      description: "Praesent eget dolor sed lectus ultrices vulputate. Vivamus id justo ut magna vehicula accumsan. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla nec est semper, ultrices metus ut.",
      project: "Redesigned the company's flagship product, improving user satisfaction by 35%. Created wireframes, prototypes, and conducted user testing with over 50 participants. Implemented design system for consistent UI components."
    },
    {
      id: 3,
      title: "Network Engineer",
      company: "Netsistem infotama",
      period: "2020 - 2021",
      description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.",
      project: "Built dashboards to visualize key business metrics. Conducted analysis that identified cost-saving opportunities worth $500,000 annually. Automated reporting processes that saved 20 hours of manual work per week."
    },
    {
      id: 4,
      title: "Teaching Assistant",
      company: "Innovate Inc.",
      period: "2019 - 2020",
      description: "Cras mattis consectetur purus sit amet fermentum. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at lobortis.",
      project: "Led product development for a mobile application with over 100,000 users. Coordinated cross-functional teams and managed release cycles. Conducted market research to identify new feature opportunities."
    }
  ];

  // State to track selected experience and view
  const [selectedExp, setSelectedExp] = useState(1);
  const [activeView, setActiveView] = useState('description'); // 'description' or 'project'

  // Find the currently selected experience
  const currentExperience = workExperiences.find(exp => exp.id === selectedExp);

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
            <p>
              {activeView === 'description' 
                ? currentExperience.description 
                : currentExperience.project}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Work;