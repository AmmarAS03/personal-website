import "./App.scss";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import AboutMe from "./components/AboutMe";
import WorkExperience from "./components/WorkExperience";
import Project from "./components/Project";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="separator" />
      <Profile />
      <div id="about-me-section" className="separator" />
      <AboutMe />
      <div id="work-experience-section" className="separator" />
      <WorkExperience />
      <div id="project-section" className="separator" />
      <Project/>
      <div className="separator" />
      <Footer/>
    </div>
  );
}

export default App;
