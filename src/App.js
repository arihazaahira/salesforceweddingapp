import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AddCouple from './pages/Addcouple';
import AddCeremony from './pages/Addceremony';
import ListCeremony from './pages/Listceremony';
import WeddingDetails from './pages/Weddingdetails';
import CoupleLogin from './pages/CoupleLogin'; // Assure-toi que le chemin est correct

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/addcouple" element={<AddCouple />} />
        <Route path="/addceremony" element={<AddCeremony />} />
        <Route path="/listceremony" element={<ListCeremony />} />
        <Route path="/ceremony/:id" element={<WeddingDetails />} />
        <Route path="/couplelogin" element={<CoupleLogin />} />


      </Routes>
    </Router>
  );
}

export default App;