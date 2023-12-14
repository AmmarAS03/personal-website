import './App.scss';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AboutMe from './components/AboutMe';
import WorkExperience from './components/WorkExperience';


function App() {
  return (
    <div className='App'>

        <Navbar/>
        <div className='separator'/>
        <Profile/>
        <div className='separator'/>
        <AboutMe/>
        <div className='separator'/>
        <WorkExperience/>

    </div>
  );
}

export default App;
