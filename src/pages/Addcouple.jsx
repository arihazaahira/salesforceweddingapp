import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveCoupleData } from '../services/AddcoupleService';
import '../styles/Addcouple.css';

const AddCouple = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Coupl_name__c: '',
    Husband_Full_Name__c: '',
    Wife_Full_Name__c: '',
    Couple_Email__c: '',
    Meeting_date__c: '',
    Notes__c: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveCoupleData(formData);
      alert('✅ Données enregistrées avec succès !');
      setFormData({
        Coupl_name__c: '',
        Husband_Full_Name__c: '',
        Wife_Full_Name__c: '',
        Couple_Email__c: '',
        Meeting_date__c: '',
        Notes__c: ''
      });
    } catch (error) {
      alert('❌ Une erreur est survenue. Vérifie la console.');
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const handleCancel = () => {
    navigate('/'); // Retour à la homepage
  };

  return (
    <div className="add-couple-container">
      <div className="add-couple-header">
        <h2>Ajouter un couple</h2>
      </div>
      
      <div className="add-couple-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label>Nom du Couple (surnom)</label>
            <input type="text" name="Coupl_name__c" value={formData.Coupl_name__c} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nom Complet du Mari</label>
            <input type="text" name="Husband_Full_Name__c" value={formData.Husband_Full_Name__c} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nom Complet de l'Épouse</label>
            <input type="text" name="Wife_Full_Name__c" value={formData.Wife_Full_Name__c} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email du Couple</label>
            <input type="email" name="Couple_Email__c" value={formData.Couple_Email__c} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date de Rencontre</label>
            <input type="date" name="Meeting_date__c" value={formData.Meeting_date__c} onChange={handleChange} required />
          </div>

          <div className="form-group full-width">
            <label>Remarques</label>
            <textarea name="Notes__c" value={formData.Notes__c} onChange={handleChange}></textarea>
          </div>

          <div className="buttons-container">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouple;