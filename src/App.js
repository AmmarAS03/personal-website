import './App.scss';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import AboutMe from './components/AboutMe';


function App() {
  return (
    <div className='App'>

        <Navbar/>
        <div className='separator'/>
        <Profile/>
        <div className='separator'/>
        <AboutMe/>

    </div>
  );
}

export default App;
