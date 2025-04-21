import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRing, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import '../styles/Homepage.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="wedding-homepage">
      <header className="hero-section">
        <div className="hero-overlay">
          <h1>Votre Mariage de Rêve Commence Ici</h1>
          <p>Planifiez chaque détail avec élégance et simplicité</p>
        </div>
      </header>

      <main className="main-content">
        <section className="feature-section ceremony-section">
          <div className="section-icon">
            <FaRing size={40} />
          </div>
          <h2>Créez Votre Cérémonie</h2>
          <p>Organisez le déroulement parfait de votre journée spéciale.</p>
          <button className="action-button" onClick={() => navigate('/addceremony')}>
            <FaPlus /> Ajouter une Cérémonie
          </button>
        </section>

        <section className="feature-section couple-section">
          <div className="section-icon">
            <FaHeart size={40} />
          </div>
          <h2>Enregistrez Votre Couple</h2>
          <p>Créez le profil de votre couple.</p>
          <button className="action-button" onClick={() => navigate('/addcouple')}>
            <FaPlus /> Ajouter un Couple
          </button>
        </section>

        <section className="feature-section list-section">
          <div className="section-icon">
            <FaCalendarAlt size={40} />
          </div>
          <h2>Vos Cérémonies</h2>
          <p>Visualisez et gérez toutes vos cérémonies.</p>
          <button className="action-button" onClick={() => navigate('/listceremony')}>
            <FaPlus /> Voir les Cérémonies
          </button>
        </section>
      </main>

      <footer className="wedding-footer">
        <p>© {new Date().getFullYear()} Planificateur de Mariage Élégant</p>
      </footer>
    </div>
  );
};

export default Homepage;