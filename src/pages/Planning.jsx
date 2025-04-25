import React, { useEffect, useState } from 'react';
import { getPlanningByWeddingId, addPlanningStep, deletePlanningStep } from '../services/PlanningService';
import '../styles/Planning.css';

const Planning = ({ weddingId }) => {
  const [planning, setPlanning] = useState([]);
  const [newStep, setNewStep] = useState({
    Name: '',
    Date__c: '',
    Description__c: '',
    Status__c: 'prevu',
    Wedding__c: weddingId,
  });

  useEffect(() => {
    fetchPlanning();
  }, []);

  const fetchPlanning = async () => {
    try {
      const data = await getPlanningByWeddingId(weddingId);
      setPlanning(data);
    } catch (error) {
      console.error('Erreur fetch:', error);
    }
  };

  const handleAdd = async () => {
    try {
      console.log('Données à envoyer :', newStep);
      const res = await addPlanningStep(newStep);
      console.log('Réponse:', res);
      setNewStep({ Name: '', Date__c: '', Description__c: '', Status__c: 'prevu', Wedding__c: weddingId });
      fetchPlanning();
    } catch (error) {
      console.error('Erreur ajout étape:', error);
      alert('Erreur lors de l’ajout : ' + error.message);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      await deletePlanningStep(id);
      fetchPlanning();
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <div className="planning-section">
      <h3>Planning du mariage</h3>

      <div className="planning-form">
        <input
          type="text"
          placeholder="Nom de l’étape"
          value={newStep.Name}
          onChange={(e) => setNewStep({ ...newStep, Name: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newStep.Date__c}
          onChange={(e) => setNewStep({ ...newStep, Date__c: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newStep.Description__c}
          onChange={(e) => setNewStep({ ...newStep, Description__c: e.target.value })}
        />
        <select
          value={newStep.Status__c}
          onChange={(e) => setNewStep({ ...newStep, Status__c: e.target.value })}
        >
          <option>prevu</option>
          <option>En cours</option>
          <option>Terminé</option>
        </select>
        <button onClick={handleAdd}>Ajouter</button>
      </div>

      <ul className="planning-list">
        {planning.length === 0 ? (
          <li>Aucune étape planifiée.</li>
        ) : (
          planning.map((step) => (
            <li key={step.Id}>
              <strong>{step.Name}</strong> - {step.Date__c?.substring(0, 10)} ({step.Status__c})<br />
              <em>{step.Description__c}</em>
              <button className="delete-btn" onClick={() => handleDelete(step.Id)}>Supprimer</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Planning;
