import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveWeddingData } from '../services/AddceremonyService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const AddWedding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
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
    console.log(name, value);
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
    <div className="h-screen bg-gradient-to-b from-indigo-50 to-purple-50 font-sans overflow-auto">
      <div className="w-full h-full flex items-center justify-center py-8" 
        style={{
          backgroundImage: "url('/assets/images/ceremony_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-indigo-900/40 backdrop-blur-sm"></div>
        
        <div className="relative w-full max-w-3xl mx-auto px-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden p-6 border border-indigo-100">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Ajouter un Mariage</h2>
              <p className="text-sm text-gray-600 mt-1">Enregistrez les détails de la cérémonie</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Mariage
                </label>
                <input 
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisateur
                </label>
                <input 
                  type="text"
                  name="Organiser_name__c"
                  value={formData.Organiser_name__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu
                </label>
                <textarea
                  name="Location__c"
                  value={formData.Location__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date et Heure
                  </label>
                  <input
                    type="datetime-local"
                    name="Date_and_Time__c"
                    value={formData.Date_and_Time__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'invités
                  </label>
                  <input
                    type="number"
                    name="Nbinvites__c"
                    value={formData.Nbinvites__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Total (DH)
                  </label>
                  <input
                    type="number"
                    name="Budget_total__c"
                    value={formData.Budget_total__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avance Payée (DH)
                  </label>
                  <input
                    type="number"
                    name="avance_paye__c"
                    value={formData.avance_paye__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="Statut__c"
                  value={formData.Statut__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="confirme">Planifié</option>
                  <option value="en cours">Confirmé</option>
                  <option value="Annule">Annulé</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button 
                  type="button" 
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-medium"
                >
                  <FaArrowLeft className="mr-2" /> Annuler
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center font-medium shadow-md"
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

export default AddWedding;