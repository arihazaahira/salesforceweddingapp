// src/components/CoupleSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CoupleSidebar.css';

const CoupleSidebar = () => {
  return (
    <div className="couple-sidebar">
      <h2 className="sidebar-title">Espace Couple</h2>
      <ul className="sidebar-menu">
        <li><Link to="/couple/home">🏠 Accueil</Link></li>
        <li><Link to="/couple/providers">💼 Prestataires</Link></li>
        <li><Link to="/couple/preferences">📝 Préférences</Link></li>
        <li><Link to="/logout">🚪 Déconnexion</Link></li>
      </ul>
    </div>
  );
};

export default CoupleSidebar;
