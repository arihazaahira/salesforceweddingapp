import React, { useState, useEffect } from 'react';
import { saveWeddingData, searchCouples } from '../services/AddceremonyService';
import { FaSave, FaTimes, FaSearch } from 'react-icons/fa';
// Import de SweetAlert2
import Swal from 'sweetalert2';

const Addceremony = ({ isOpen, onClose }) => {
  // État du thème - utilisé pour les classes conditionnelles
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    Couple_name__c: '', // Nouveau champ lookup
    Organiser_name__c: '',
    Location__c: '',
    Date_and_Time__c: '',
    Nbinvites__c: '',
    Budget_total__c: '',
    avance_paye__c: '',
    Statut__c: ''
  });
  
  // États pour la gestion des erreurs et du comportement du lookup
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [coupleResults, setCoupleResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Check for dark mode preference in local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [isOpen]);

  // Effet pour valider le formulaire
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Effet pour le champ de recherche avec meilleure gestion des erreurs
  useEffect(() => {
    const fetchCouples = async () => {
      if (searchTerm.length >= 1) {
        try {
          setIsSearching(true);
          console.log("Recherche de couples avec le terme:", searchTerm);
          
          const results = await searchCouples(searchTerm);
          
          // Vérification explicite que results est un tableau
          if (Array.isArray(results)) {
            console.log("Résultats obtenus:", results);
            setCoupleResults(results);
            setShowDropdown(true);
          } else {
            console.warn("Résultats non valides reçus:", results);
            setCoupleResults([]);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error('Erreur lors de la recherche des couples:', error);
          setCoupleResults([]);
          setErrors(prev => ({
            ...prev,
            search: 'Impossible de charger les données des couples'
          }));
        } finally {
          setIsSearching(false);
        }
      } else {
        setCoupleResults([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchCouples, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Test de connexion à l'ouverture du modal
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test de connexion simple avec une lettre
        console.log("Test de connexion à Salesforce...");
        const testSearch = await searchCouples('a');
        console.log('Test de connexion à Salesforce réussi:', testSearch);
      } catch (error) {
        console.error('Erreur de connexion à Salesforce:', error);
      }
    };
    
    if (isOpen) {
      testConnection();
    }
  }, [isOpen]);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validation pour le couple (obligatoire)
    if (!formData.Couple_name__c) {
      newErrors.Couple_name__c = 'Veuillez sélectionner un couple';
      isValid = false;
    }

    // Validation pour le lieu (obligatoire)
    if (!formData.Location__c) {
      newErrors.Location__c = 'Le lieu est requis';
      isValid = false;
    }

    // Validation pour la date (obligatoire et doit être future)
    if (!formData.Date_and_Time__c) {
      newErrors.Date_and_Time__c = 'La date et l\'heure sont requises';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.Date_and_Time__c);
      if (selectedDate <= new Date()) {
        newErrors.Date_and_Time__c = 'La date doit être dans le futur';
        isValid = false;
      }
    }

    // Validation pour le nombre d'invités (nombre positif)
    if (formData.Nbinvites__c && parseInt(formData.Nbinvites__c) <= 0) {
      newErrors.Nbinvites__c = 'Le nombre d\'invités doit être positif';
      isValid = false;
    }

    // Validation pour le budget (nombre positif)
    if (formData.Budget_total__c && parseInt(formData.Budget_total__c) <= 0) {
      newErrors.Budget_total__c = 'Le budget doit être positif';
      isValid = false;
    }

    // Validation pour l'avance (nombre positif et inférieur au budget)
    if (formData.avance_paye__c) {
      if (parseInt(formData.avance_paye__c) < 0) {
        newErrors.avance_paye__c = 'L\'avance doit être positive';
        isValid = false;
      } else if (formData.Budget_total__c && parseInt(formData.avance_paye__c) > parseInt(formData.Budget_total__c)) {
        newErrors.avance_paye__c = 'L\'avance ne peut pas dépasser le budget total';
        isValid = false;
      }
    }

    // Validation pour le statut (obligatoire)
    if (!formData.Statut__c) {
      newErrors.Statut__c = 'Veuillez sélectionner un statut';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoupleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCoupleSelect = (couple) => {
    console.log("Couple sélectionné:", couple);
    setFormData(prev => ({
      ...prev,
      Couple_name__c: couple.Id
    }));
    setSearchTerm(couple.Name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      // Scroll to first error
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      await saveWeddingData(formData);
      
      // Notification de succès avec une alerte standard au lieu de SweetAlert
      alert('✅ Mariage enregistré avec succès!');
      
      onClose();
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      
      // Gestion détaillée des erreurs avec une alerte standard
      let errorMessage = 'Une erreur est survenue lors de l\'enregistrement';
      
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        // qui se situe en dehors de la plage 2xx
        if (error.response.data && error.response.data.length > 0) {
          errorMessage = `Erreur: ${error.response.data[0].message || error.response.data[0].errorCode}`;
        } else if (error.response.status === 401) {
          errorMessage = 'Session expirée, veuillez vous reconnecter';
        } else if (error.response.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions nécessaires';
        } else if (error.response.status === 404) {
          errorMessage = 'Ressource introuvable sur Salesforce';
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        errorMessage = 'Impossible de joindre le serveur, vérifiez votre connexion';
      }
      
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Couple_name__c: '',
      Organiser_name__c: '',
      Location__c: '',
      Date_and_Time__c: '',
      Nbinvites__c: '',
      Budget_total__c: '',
      avance_paye__c: '',
      Statut__c: ''
    });
    setErrors({});
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300`} style={{ maxHeight: '90vh' }}>
          {/* Fixed header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Ajouter un Mariage</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          {/* Scrollable form area */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Champ de recherche pour Couple */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couple <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleCoupleSearch}
                    placeholder="Rechercher un couple..."
                    className={`w-full pl-10 pr-3 py-2 border ${errors.Couple_name__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                      {Array.isArray(coupleResults) && coupleResults.length > 0 ? (
                        coupleResults.map((couple) => (
                          <div
                            key={couple.Id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCoupleSelect(couple)}
                          >
                            {couple.Name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">Aucun résultat trouvé</div>
                      )}
                    </div>
                  )}
                </div>
                {errors.Couple_name__c && (
                  <p className="mt-1 text-sm text-red-500">{errors.Couple_name__c}</p>
                )}
                {errors.search && (
                  <p className="mt-1 text-sm text-red-500">{errors.search}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisateur
                </label>
                <input
                  type="text"
                  name="Organiser_name__c"
                  value={formData.Organiser_name__c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="Location__c"
                  value={formData.Location__c}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.Location__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none bg-white text-gray-900`}
                  rows="2"
                />
                {errors.Location__c && (
                  <p className="mt-1 text-sm text-red-500">{errors.Location__c}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date et Heure <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="Date_and_Time__c"
                    value={formData.Date_and_Time__c}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.Date_and_Time__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                  />
                  {errors.Date_and_Time__c && (
                    <p className="mt-1 text-sm text-red-500">{errors.Date_and_Time__c}</p>
                  )}
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
                    className={`w-full px-3 py-2 border ${errors.Nbinvites__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                  />
                  {errors.Nbinvites__c && (
                    <p className="mt-1 text-sm text-red-500">{errors.Nbinvites__c}</p>
                  )}
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
                    className={`w-full px-3 py-2 border ${errors.Budget_total__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                  />
                  {errors.Budget_total__c && (
                    <p className="mt-1 text-sm text-red-500">{errors.Budget_total__c}</p>
                  )}
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
                    className={`w-full px-3 py-2 border ${errors.avance_paye__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                  />
                  {errors.avance_paye__c && (
                    <p className="mt-1 text-sm text-red-500">{errors.avance_paye__c}</p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut <span className="text-red-500">*</span>
                </label>
                <select
                  name="Statut__c"
                  value={formData.Statut__c}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.Statut__c ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white text-gray-900`}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="En cours">En cours</option>
                  <option value="Confirmé">Confirme</option>
                  <option value="Annulé">Annule</option>
                </select>
                {errors.Statut__c && (
                  <p className="mt-1 text-sm text-red-500">{errors.Statut__c}</p>
                )}
              </div>
            </form>
          </div>

          {/* Fixed footer */}
          <div className="flex justify-between p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2 ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'} text-white rounded-lg transition-all flex items-center font-medium shadow-md`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addceremony;