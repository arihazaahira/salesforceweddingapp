import React, { useState, useEffect } from 'react';
import { saveCoupleData } from '../services/AddcoupleService';
import { FaSave, FaTimes } from 'react-icons/fa';

const Addcouple = ({ isOpen, onClose }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    Husband_Full_Name__c: '',
    Wife_Full_Name__c: '',
    Couple_Email__c: '',
    Meeting_date__c: '',
    Notes__c: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Nom du mari
    if (!formData.Husband_Full_Name__c.trim()) {
      newErrors.Husband_Full_Name__c = "Le nom du mari est requis.";
    } else if (!nameRegex.test(formData.Husband_Full_Name__c)) {
      newErrors.Husband_Full_Name__c = "Le nom du mari doit contenir uniquement des lettres.";
    }

    // Nom de l'épouse
    if (!formData.Wife_Full_Name__c.trim()) {
      newErrors.Wife_Full_Name__c = "Le nom de l'épouse est requis.";
    } else if (!nameRegex.test(formData.Wife_Full_Name__c)) {
      newErrors.Wife_Full_Name__c = "Le nom de l'épouse doit contenir uniquement des lettres.";
    }

    // Email
    if (!formData.Couple_Email__c.trim()) {
      newErrors.Couple_Email__c = "L'email est requis.";
    } else if (!emailRegex.test(formData.Couple_Email__c)) {
      newErrors.Couple_Email__c = "Format d'email invalide.";
    }

    // Date de rencontre (doit être dans le passé)
    if (!formData.Meeting_date__c) {
      newErrors.Meeting_date__c = "La date de rencontre est requise.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const meetingDate = new Date(formData.Meeting_date__c);
      if (meetingDate > today) {
        newErrors.Meeting_date__c = "La date de rencontre doit être dans le passé.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // n'envoie rien si erreurs
    }

    try {
      await saveCoupleData(formData);
      alert('✅ Données enregistrées avec succès !');
      onClose();
      setFormData({
        Husband_Full_Name__c: '',
        Wife_Full_Name__c: '',
        Couple_Email__c: '',
        Meeting_date__c: '',
        Notes__c: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur Salesforce :', error);
      alert("❌ Une erreur est survenue lors de l'enregistrement.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto transition-colors duration-300">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Ajouter un couple</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaTimes className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom Complet du Mari
                </label>
                <input
                  type="text"
                  name="Husband_Full_Name__c"
                  value={formData.Husband_Full_Name__c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.Husband_Full_Name__c && (
                  <p className="text-red-500 text-sm mt-1">{errors.Husband_Full_Name__c}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom Complet de l'Épouse
                </label>
                <input
                  type="text"
                  name="Wife_Full_Name__c"
                  value={formData.Wife_Full_Name__c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.Wife_Full_Name__c && (
                  <p className="text-red-500 text-sm mt-1">{errors.Wife_Full_Name__c}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email du Couple
                </label>
                <input
                  type="email"
                  name="Couple_Email__c"
                  value={formData.Couple_Email__c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.Couple_Email__c && (
                  <p className="text-red-500 text-sm mt-1">{errors.Couple_Email__c}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date de Rencontre
                </label>
                <input
                  type="date"
                  name="Meeting_date__c"
                  value={formData.Meeting_date__c}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                {errors.Meeting_date__c && (
                  <p className="text-red-500 text-sm mt-1">{errors.Meeting_date__c}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Remarques
              </label>
              <textarea
                name="Notes__c"
                value={formData.Notes__c}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              ></textarea>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 flex items-center"
              >
                <FaSave className="mr-2" /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addcouple;
