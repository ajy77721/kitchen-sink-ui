import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '../src/assets/css/core/libs.min.css';
import '../src/assets/css/coinex.min.css?v=4.1.0';
import '../src/assets/css/custom.min.css?v=4.1.0';
import '../src/assets/css/Global.css';
import Login from './pages/Authentication/Login/Login';
import Sidebar from './components/Sidebar/Sidebar';
import MyProfile from './pages/Profile/MyProfile/MyProfile';
import Members from './pages/Members/Members';
import User from './pages/Users/User';


function App() {
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<></>} /> */}


        {/* login */}
        <Route path="/*" element={<Login />} />
        <Route path="/dashboard" element={<><Sidebar /><User /></>} />
        <Route path="/profile" element={<><Sidebar /><MyProfile /></>} />
        <Route path="/members" element={<><Sidebar /><Members /></>} />
      
      

      </Routes>
    </div>
  );
}

export default App;
