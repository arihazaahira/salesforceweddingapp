import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AddCouple from './pages/Addcouple';
import './styles/Homepage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/addcouple" element={<AddCouple />} />
      </Routes>
    </Router>
  );
}

export default App;