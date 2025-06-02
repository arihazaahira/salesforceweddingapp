import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import GuestTable from './GuestTable';
import Planning from './Planning';
import Providerlist from './Providerlist';
import TaskChecklist from './TaskChecklist';
import FeedbackPage from './FeedbackPage';
import CoupleModal from './CoupleModal';
import CeremonyModal from './CeremonyModal';
import { getWeddingById } from '../services/WeddingService'; // Tu dois créer cette fonction dans WeddingService.js
import '../styles/WeddingDetails.css';
import { Calendar as CalendarIcon, MapPin as MapPinIcon, Users as UsersIcon } from 'lucide-react'; // Optionnel

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [section, setSection] = useState('invites');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [coupleModalOpen, setCoupleModalOpen] = useState(false);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const data = await getWeddingById(id);
        setWedding(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setError('Impossible de charger les détails de la cérémonie');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!wedding) return <div>Aucune donnée trouvée.</div>;

  return (
    <div className="wedding-details-container">
      {/* En-tête avec infos de la cérémonie */}
      <div className="wedding-header">
        <h1 className="wedding-title">{wedding.Name}</h1>
        
        <div className="wedding-meta">
          <div className="meta-item">
            <CalendarIcon className="meta-icon" />
            <span>{new Date(wedding.Date_and_Time__c).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div className="meta-item">
            <MapPinIcon className="meta-icon" />
            <span>{wedding.Location__c || 'Lieu non spécifié'}</span>
          </div>
        </div>
        
        {wedding.Description__c && (
          <div className="wedding-description">
            <p>{wedding.Description__c}</p>
          </div>
        )}
      </div>
  
      {/* Navigation par onglets stylisée */}
      <div className="tabs-container">
        <nav className="tabs-navigation">
          <button 
            className={`tab-button ${section === 'prestataires' ? 'active' : ''}`}
            onClick={() => setSection('prestataires')}
          >
            <UsersIcon className="tab-icon" />
            <span>Prestataires</span>
          </button>
        </nav>
      </div>
  
      {/* Contenu de la section */}
      <div className="section-content">
        {section === 'prestataires' && <Providerlist weddingId={id} />}
      </div>
    </div>
  );
};

export default WeddingDetails;