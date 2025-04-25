import React, { useState, useEffect } from 'react';
import { saveWeddingData } from '../services/AddceremonyService';
import { FaSave, FaTimes } from 'react-icons/fa';

const Addceremony = ({ isOpen, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
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

  // Check for dark mode preference in local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      onClose();
      // Reset form
      setFormData({
        Name: '',
        Organiser_name__c: '',
        Location__c: '',
        Date_and_Time__c: '',
        Nbinvites__c: '',
        Budget_total__c: '',
        avance_paye__c: '',
        Statut__c: ''
      });
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('❌ Une erreur est survenue. Vérifie la console.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300" style={{ maxHeight: '90vh' }}>
          {/* Fixed header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ajouter un Mariage</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Scrollable form area */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom du Mariage
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organisateur
                  </label>
                  <input
                    type="text"
                    name="Organiser_name__c"
                    value={formData.Organiser_name__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lieu
                </label>
                <textarea
                  name="Location__c"
                  value={formData.Location__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date et Heure
                  </label>
                  <input
                    type="datetime-local"
                    name="Date_and_Time__c"
                    value={formData.Date_and_Time__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre d'invités
                  </label>
                  <input
                    type="number"
                    name="Nbinvites__c"
                    value={formData.Nbinvites__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget Total (DH)
                  </label>
                  <input
                    type="number"
                    name="Budget_total__c"
                    value={formData.Budget_total__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Avance Payée (DH)
                  </label>
                  <input
                    type="number"
                    name="avance_paye__c"
                    value={formData.avance_paye__c}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Statut
                </label>
                <select
                  name="Statut__c"
                  value={formData.Statut__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="confirme">Planifié</option>
                  <option value="en cours">Confirmé</option>
                  <option value="Annule">Annulé</option>
                </select>
              </div>
            </form>
          </div>

          {/* Fixed footer */}
          <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center font-medium shadow-md"
            >
              <FaSave className="mr-2" /> Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addceremony;