import React, { useEffect, useRef } from 'react';
import styles from "../assets/scss/BoxBackground.module.scss";

const BoxBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const gridSize = 20; // Size between grid lines in pixels
    
    // Clear any existing grid lines
    container.innerHTML = '';
    
    // Create horizontal grid lines
    const containerHeight = window.innerHeight;
    const horizontalLinesCount = Math.ceil(containerHeight / gridSize);
    
    for (let i = 0; i <= horizontalLinesCount; i++) {
      const line = document.createElement('div');
      line.className = styles.gridLineHorizontal;
      line.style.top = `${i * gridSize}px`;
      container.appendChild(line);
    }
    
    // Create vertical grid lines
    const containerWidth = window.innerWidth;
    const verticalLinesCount = Math.ceil(containerWidth / gridSize);
    
    for (let i = 0; i <= verticalLinesCount; i++) {
      const line = document.createElement('div');
      line.className = styles.gridLineVertical;
      line.style.left = `${i * gridSize}px`;
      container.appendChild(line);
    }
    
    // Handle resize
    const handleResize = () => {
      // This is a simplified approach - for production, 
      // you might want to debounce this function
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      const newContainerHeight = window.innerHeight;
      const newHorizontalLinesCount = Math.ceil(newContainerHeight / gridSize);
      
      for (let i = 0; i <= newHorizontalLinesCount; i++) {
        const line = document.createElement('div');
        line.className = styles.gridLineHorizontal;
        line.style.top = `${i * gridSize}px`;
        container.appendChild(line);
      }
      
      const newContainerWidth = window.innerWidth;
      const newVerticalLinesCount = Math.ceil(newContainerWidth / gridSize);
      
      for (let i = 0; i <= newVerticalLinesCount; i++) {
        const line = document.createElement('div');
        line.className = styles.gridLineVertical;
        line.style.left = `${i * gridSize}px`;
        container.appendChild(line);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      <div className={styles.animatedGrid} ref={containerRef}></div>
      <div className={styles.boxFadeOverlay}></div>
    </>
  );
};

export default BoxBackground;