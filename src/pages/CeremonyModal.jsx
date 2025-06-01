import React, { useState, useEffect } from 'react';
import { fetchAllCeremonies, deleteCeremony } from '../services/ListCeremonyService';

const CeremonyModal = ({ isOpen, onClose }) => {
  const [ceremonies, setCeremonies] = useState([]);
  const [filteredCeremonies, setFilteredCeremonies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCeremonies = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCeremonies();
      setCeremonies(data);
      setFilteredCeremonies(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (ceremonyId, coupleName) => {
    if (window.confirm(`Supprimer la cérémonie de ${coupleName} ?`)) {
      try {
        await deleteCeremony(ceremonyId);
        loadCeremonies();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Filtrer en temps réel lors de la saisie
  useEffect(() => {
    console.log('Searching for:', searchTerm);
    console.log('All ceremonies:', ceremonies);
    
    if (searchTerm.trim() === '') {
      setFilteredCeremonies(ceremonies);
    } else {
      const filtered = ceremonies.filter(ceremony => {
        const coupleName = ceremony.Couple_Name__c || '';
        return coupleName.toLowerCase().includes(searchTerm.toLowerCase());
      });
      console.log('Filtered ceremonies:', filtered);
      setFilteredCeremonies(filtered);
    }
  }, [searchTerm, ceremonies]);

  useEffect(() => {
    if (isOpen) {
      loadCeremonies();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Cérémonies</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold transition-colors leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="p-6 border-b bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par nom de couple..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <svg className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Chargement des cérémonies...</p>
            </div>
          ) : filteredCeremonies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl">Aucune cérémonie trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCeremonies.map((ceremony) => (
                <div
                  key={ceremony.Id}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {ceremony.Couple_Name__c || 'Nom non défini'}
                        </h3>
                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                          {ceremony.Statut__c || 'Statut non défini'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-lg">
                          {ceremony.Date_and_Time__c ? 
                            new Date(ceremony.Date_and_Time__c).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Date non définie'
                          }
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(ceremony.Id, ceremony.Couple_Name__c)}
                      className="ml-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            {filteredCeremonies.length} cérémonie(s) affichée(s)
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CeremonyModal;