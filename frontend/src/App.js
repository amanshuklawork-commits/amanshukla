import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import Chatbot from './components/Chatbot';
import LiquidTransition from './components/LiquidTransition';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Emergency from './pages/Emergency';
import Family from './pages/Family';
import HealthStats from './pages/HealthStats';
import HospitalsGPS from './pages/Hospitals_GPS';
import WaterTrackerFull from './pages/WaterTracker_Full';
import SymptomsTrackerFull from './pages/SymptomsTracker_Full';
import AddMedicine from './pages/AddMedicine';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <LiquidTransition>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="/calendar"     element={<Calendar />} />
              <Route path="/emergency"    element={<Emergency />} />
              <Route path="/family"       element={<Family />} />
              <Route path="/health-stats" element={<HealthStats />} />
              <Route path="/hospitals"    element={<HospitalsGPS />} />
              <Route path="/water-tracker" element={<WaterTrackerFull />} />
              <Route path="/symptoms"     element={<SymptomsTrackerFull />} />
              <Route path="/add-medicine" element={<AddMedicine />} />
            </Routes>
          </LiquidTransition>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;