import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRing, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="wedding-homepage">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay">
          <h1>Votre Mariage de Rêve Commence Ici</h1>
          <p>Planifiez chaque détail avec élégance et simplicité</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Section 1: Ajouter une Cérémonie */}
        <section className="feature-section ceremony-section">
          <div className="section-icon">
            <FaRing size={40} />
          </div>
          <h2>Créez Votre Cérémonie</h2>
          <p>Organisez le déroulement parfait de votre journée spéciale avec notre outil de planification détaillée.</p>
          <button className="action-button">
            <FaPlus /> Ajouter une Cérémonie
          </button>
        </section>

        {/* Section 2: Ajouter un Couple */}
        <section className="feature-section couple-section">
          <div className="section-icon">
            <FaHeart size={40} />
          </div>
          <h2>Enregistrez Votre Couple</h2>
          <p>Créez le profil de votre couple et commencez à personnaliser votre expérience de planification.</p>
          <button 
            className="action-button"
            onClick={() => navigate('/addcouple')}
          >
            <FaPlus /> Ajouter un Couple
          </button>
        </section>

        {/* Section 3: Liste des Cérémonies */}
        <section className="feature-section list-section">
          <div className="section-icon">
            <FaCalendarAlt size={40} />
          </div>
          <h2>Vos Cérémonies</h2>
          <p>Visualisez et gérez toutes vos cérémonies planifiées en un seul endroit.</p>
          <button className="action-button">
            <FaPlus /> Voir les Cérémonies
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="wedding-footer">
        <p>© {new Date().getFullYear()} Planificateur de Mariage Élégant. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Homepage;