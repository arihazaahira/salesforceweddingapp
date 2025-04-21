import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveWeddingData } from '../services/AddceremonyService'; // Assure-toi que ce service existe
import '../styles/Addceremony.css';

const AddWedding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',  // Corrigé ici : wedding_name__c
    Organiser_name__c: '',
    Location__c: '',
    Date_and_Time__c: '',
    Nbinvites__c: '',
    Budget_total__c: '',
    avance_paye__c: '',
    Statut__c: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);  // Ajoute cette ligne pour vérifier la mise à jour
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveWeddingData(formData);
      alert('✅ Données du mariage enregistrées avec succès !');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('❌ Une erreur est survenue. Vérifie la console.');
    }
  };

  return (
    <div className="add-wedding-container">
      <h2>Ajouter un Mariage</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du Mariage</label>
          <input
            type="text"
            name="Name"  // Assure-toi que le name correspond à l'état
            value={formData.Name}  // Corrigé ici
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Organisateur</label>
          <input
            type="text"
            name="Organiser_name__c"
            value={formData.Organiser_name__c}
            onChange={handleChange}
          />
        </div>

        

        <div className="form-group">
          <label>Lieu</label>
          <textarea
            name="Location__c"
            value={formData.Location__c}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date et Heure</label>
          <input
            type="datetime-local"
            name="Date_and_Time__c"
            value={formData.Date_and_Time__c}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Nombre d'invités</label>
          <input
            type="number"
            name="Nbinvites__c"
            value={formData.Nbinvites__c}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Budget Total (DH)</label>
          <input
            type="number"
            name="Budget_total__c"
            value={formData.Budget_total__c}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Avance Payée (DH)</label>
          <input
            type="number"
            name="avance_paye__c"
            value={formData.avance_paye__c}  // Corrigé ici
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Statut</label>
          <select
            name="Statut__c"
            value={formData.Statut__c}
            onChange={handleChange}
          >
            <option value="">-- Sélectionner --</option>
            <option value="confirme">Planifié</option>
            <option value="en cours">Confirmé</option>
            <option value="Annule">Annulé</option>
          </select>
        </div>

        <div className="buttons-container">
          <button type="submit" className="submit-button">Enregistrer</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default AddWedding;
