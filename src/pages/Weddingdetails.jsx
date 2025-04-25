import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWeddingById } from '../services/WeddingService'; // Tu dois créer cette fonction dans WeddingService.js
import '../styles/WeddingDetails.css'; // Optionnel

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
    <div className="wedding-details">
      <h2>Cérémonie : {wedding.Name}</h2>
      <p><strong>Date :</strong> {wedding.Date_and_Time__c}</p>
      <p><strong>Lieu :</strong> {wedding.Location__c || '-'}</p>
      <p><strong>Description :</strong> {wedding.Description__c || '-'}</p>

      <div className="tabs">
        <button onClick={() => setSection('invites')}>Invités</button>
        <button onClick={() => setSection('planning')}>Planning</button>
        <button onClick={() => setSection('prestataires')}>Prestataires</button>
        <button onClick={() => setSection('taches')}>Tâches</button>
        <button onClick={() => setSection('feedback')}>Feedback</button>
      </div>

      <div className="section-content">
        {section === 'invites' && <p>📋 Section Invités (à développer)</p>}
        {section === 'planning' && <p>🗓️ Planning (à venir)</p>}
        {section === 'prestataires' && <p>📦 Prestataires (à venir)</p>}
        {section === 'taches' && <p>✅ Tâches (à venir)</p>}
        {section === 'feedback' && <p>💬 Feedback (à venir)</p>}
      </div>

      {/* Modal components */}
      {ceremonyModalOpen && (
        <CeremonyModal 
          isOpen={ceremonyModalOpen} 
          onClose={() => setCeremonyModalOpen(false)}
        />
      )}
      
      {coupleModalOpen && (
        <CoupleModal 
          isOpen={coupleModalOpen} 
          onClose={() => setCoupleModalOpen(false)}
        />
      )}
    </>
  );
};

export default WeddingDetails;