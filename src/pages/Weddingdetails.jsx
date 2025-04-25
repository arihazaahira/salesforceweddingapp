import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWeddingById } from '../services/WeddingService';
import '../styles/WeddingDetails.css'; // On stylise ici
import GuestTable from './GuestTable';
import Planning from './Planning';
import FeedbackPage from './FeedbackPage';
import ProviderList from './Providerlist';
import TaskChecklist from './TaskChecklist';

const WeddingDetails = () => {
  const { id } = useParams();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('invites');

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const data = await getWeddingById(id);
        setWedding(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!wedding) return <div className="error">Aucune donnée trouvée.</div>;

  return (
    <div className="wedding-details-container">
      <div className="wedding-header">
        <h2>Cérémonie : {wedding.Name}</h2>
        <p><strong>Date :</strong> {wedding.Date_and_Time__c}</p>
        <p><strong>Lieu :</strong> {wedding.Location__c || '-'}</p>
        <p><strong>Description :</strong> {wedding.Description__c || '-'}</p>
      </div>

      <div className="tabs">
        <button className={section === 'invites' ? 'active' : ''} onClick={() => setSection('invites')}>Invités</button>
        <button className={section === 'planning' ? 'active' : ''} onClick={() => setSection('planning')}>Planning</button>
        <button className={section === 'prestataires' ? 'active' : ''} onClick={() => setSection('prestataires')}>Prestataires</button>
        <button className={section === 'taches' ? 'active' : ''} onClick={() => setSection('taches')}>Tâches</button>
        <button className={section === 'feedback' ? 'active' : ''} onClick={() => setSection('feedback')}>Feedback</button>
      </div>

      <div className="section-content">
        {section === 'invites' && <GuestTable weddingId={wedding.Id} />}
        {section === 'planning' && <Planning weddingId={wedding.Id} />}
        {section === 'prestataires' && <ProviderList weddingId={wedding.Id} />}
        {section === 'taches' && <TaskChecklist weddingId={wedding.Id} />}
        {section === 'feedback' && <FeedbackPage weddingId={wedding.Id} />}
      </div>
    </div>
  );
};

export default WeddingDetails;
