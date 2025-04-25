import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCeremonies } from '../services/ListCeremonyService';
import { Calendar, Eye, Search } from 'lucide-react';
import Headers from '../components/Headers';
import CeremonyModal from './Addceremony';
import CoupleModal from './Addcouple';
import '../styles/Listceremony.css';

const ListCeremony = () => {
  const [ceremonies, setCeremonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [coupleModalOpen, setCoupleModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllCeremonies();
        setCeremonies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredCeremonies = ceremonies.filter(ceremony =>
    ceremony.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ceremony.Location__c && ceremony.Location__c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openCeremonyModal = () => {
    setCeremonyModalOpen(true);
  };

  const openCoupleModal = () => {
    setCoupleModalOpen(true);
  };

  if (loading) return (
    <>
      <Headers 
        toggleSidebar={toggleSidebar} 
        openCeremonyModal={openCeremonyModal} 
        openCoupleModal={openCoupleModal} 
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors pt-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-600 dark:border-pink-400 mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Chargement en cours...</p>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Headers 
        toggleSidebar={toggleSidebar} 
        openCeremonyModal={openCeremonyModal} 
        openCoupleModal={openCoupleModal} 
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors pt-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Erreur</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Headers 
        toggleSidebar={toggleSidebar} 
        openCeremonyModal={openCeremonyModal} 
        openCoupleModal={openCoupleModal} 
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 md:px-8 transition-colors pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center">
                <Calendar size={28} className="mr-2 text-pink-600 dark:text-pink-400" />
                Liste des Cérémonies
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez et suivez toutes vos cérémonies
              </p>
            </div>
            
            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all border border-gray-100 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                    <th className="px-6 py-4 text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Date et Heure</th>
                    <th className="px-6 py-4 text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Lieu</th>
                    <th className="px-6 py-4 text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCeremonies.length > 0 ? (
                    filteredCeremonies.map(ceremony => (
                      <tr 
                        key={ceremony.Id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900 dark:text-white">{ceremony.Name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700 dark:text-gray-300">{formatDate(ceremony.Date_and_Time__c)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700 dark:text-gray-300">{ceremony.Location__c || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700 dark:text-gray-300 max-w-xs truncate">{ceremony.Description__c || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => navigate(`/ceremony/${ceremony.Id}`)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-gray-800 transition-all"
                          >
                            <Eye size={16} className="mr-2" />
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center">
                          <Calendar size={40} className="text-gray-400 dark:text-gray-600 mb-3" />
                          <p className="text-lg font-medium mb-1">Aucune cérémonie trouvée</p>
                          <p className="text-sm">Ajoutez une nouvelle cérémonie ou modifiez votre recherche</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={openCeremonyModal}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Ajouter une Cérémonie
            </button>
          </div>
        </div>
      </div>

      {/* Modal components */}
      {ceremonyModalOpen && (
        <CeremonyModal 
          isOpen={ceremonyModalOpen} 
          onClose={() => setCeremonyModalOpen(false)}
        />
      )}
      
      {coupleModalOpen && (
        <CoupleModal 
          isOpen={coupleModalOpen} 
          onClose={() => setCoupleModalOpen(false)}
        />
      )}
    </>
  );
};

export default ListCeremony;