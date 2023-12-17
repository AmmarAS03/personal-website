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
      <div className="separator" />
      <div id="about-me-section">
      <AboutMe />
      </div>
      <div className="separator" />
      <div id="work-experience-section">
      <WorkExperience />
      </div>
      <div className="separator" />
      <div id="project-section">
      <Project/>
      </div>
      <div className="separator" />
      <div className="separator" />
      <Footer/>
    </div>
  );
}

export default App;
