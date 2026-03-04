import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AddMedicine from './pages/AddMedicine';
import Hospitals from './pages/Hospitals_GPS';
import Emergency from './pages/Emergency';
import Calendar from './pages/Calendar';
import WaterTracker from './pages/WaterTracker_Full';
import SymptomsTracker from './pages/SymptomsTracker_Full';
import HealthStats from './pages/HealthStats';
import Family from './pages/Family';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddMedicine />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/water" element={<WaterTracker />} />
        <Route path="/symptoms" element={<SymptomsTracker />} />
        <Route path="/stats" element={<HealthStats />} />
        <Route path="/family" element={<Family />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;