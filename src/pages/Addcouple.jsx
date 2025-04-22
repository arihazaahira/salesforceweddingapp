import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveCoupleData } from '../services/AddcoupleService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 font-sans">
      {/* Hero Section with Form */}
      <div className="relative w-full min-h-screen py-12 flex items-center justify-center" 
        style={{
          backgroundImage: "url('/assets/images/couple_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-pink-900/40 backdrop-blur-sm"></div>
        
        <div className="relative w-full max-w-3xl mx-auto px-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-6 border border-pink-100">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Ajouter un couple</h2>
              <p className="text-sm text-gray-600 mt-1">Enregistrez les informations du futur couple marié</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Couple (surnom)
                </label>
                <input 
                  type="text" 
                  name="Coupl_name__c" 
                  value={formData.Coupl_name__c} 
                  onChange={handleChange} 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet du Mari
                  </label>
                  <input 
                    type="text" 
                    name="Husband_Full_Name__c" 
                    value={formData.Husband_Full_Name__c} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet de l'Épouse
                  </label>
                  <input 
                    type="text" 
                    name="Wife_Full_Name__c" 
                    value={formData.Wife_Full_Name__c} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email du Couple
                  </label>
                  <input 
                    type="email" 
                    name="Couple_Email__c" 
                    value={formData.Couple_Email__c} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de Rencontre
                  </label>
                  <input 
                    type="date" 
                    name="Meeting_date__c" 
                    value={formData.Meeting_date__c} 
                    onChange={handleChange} 
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarques
                </label>
                <textarea 
                  name="Notes__c" 
                  value={formData.Notes__c} 
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex justify-between pt-2">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-medium"
                >
                  <FaArrowLeft className="mr-2" /> Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all flex items-center font-medium shadow-md"
                >
                  <FaSave className="mr-2" /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCouple;