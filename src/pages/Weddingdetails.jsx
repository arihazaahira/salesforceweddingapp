import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWeddingById } from '../services/WeddingService';
import { Calendar, MapPin, Clock, FileText, Users, Calendar as CalendarIcon, Package, CheckSquare, MessageCircle } from 'lucide-react';
import Headers from '../components/Headers';
import CeremonyModal from './Addceremony';
import CoupleModal from './Addcouple';
import '../styles/WeddingDetails.css';

const WeddingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [section, setSection] = useState('invites');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [coupleModalOpen, setCoupleModalOpen] = useState(false);

  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const data = await getWeddingById(id);
        setWedding(data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setError('Impossible de charger les détails de la cérémonie');
      } finally {
        setLoading(false);
      }
    };

    fetchWedding();
  }, [id]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openCeremonyModal = () => {
    setCeremonyModalOpen(true);
  };

  const openCoupleModal = () => {
    setCoupleModalOpen(true);
  };

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
            onClick={() => navigate('/listceremony')} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    </>
  );

  if (!wedding) return (
    <>
      <Headers 
        toggleSidebar={toggleSidebar} 
        openCeremonyModal={openCeremonyModal} 
        openCoupleModal={openCoupleModal} 
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors pt-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <svg className="h-8 w-8 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Cérémonie introuvable</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Les données de la cérémonie demandée n'ont pas été trouvées.</p>
          <button 
            onClick={() => navigate('/listceremony')} 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retour à la liste
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
        <div className="max-w-6xl mx-auto">
          {/* Hero section with ceremony details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 h-16 flex items-center px-6">
              <h1 className="text-2xl font-bold text-white">{wedding.Name}</h1>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <Calendar className="text-pink-600 dark:text-pink-400 w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date et heure</h3>
                    <p className="text-gray-900 dark:text-gray-100">{formatDate(wedding.Date_and_Time__c)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="text-pink-600 dark:text-pink-400 w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lieu</h3>
                    <p className="text-gray-900 dark:text-gray-100">{wedding.Location__c || '-'}</p>
                  </div>
                </div>

                {wedding.Couple__r && (
                  <div className="flex items-start space-x-3">
                    <Users className="text-pink-600 dark:text-pink-400 w-5 h-5 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Couple</h3>
                      <p className="text-gray-900 dark:text-gray-100">{wedding.Couple__r.Name || '-'}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {wedding.Description__c && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <FileText className="text-pink-600 dark:text-pink-400 w-4 h-4 mr-2" />
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{wedding.Description__c}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabs navigation */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <div className="flex space-x-1 p-1">
              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md flex items-center justify-center
                  ${section === 'invites' 
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                onClick={() => setSection('invites')}
              >
                <Users className="mr-2 h-5 w-5" />
                Invités
              </button>

              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md flex items-center justify-center
                  ${section === 'planning' 
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                onClick={() => setSection('planning')}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Planning
              </button>

              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md flex items-center justify-center
                  ${section === 'prestataires' 
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                onClick={() => setSection('prestataires')}
              >
                <Package className="mr-2 h-5 w-5" />
                Prestataires
              </button>

              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md flex items-center justify-center
                  ${section === 'taches' 
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                onClick={() => setSection('taches')}
              >
                <CheckSquare className="mr-2 h-5 w-5" />
                Tâches
              </button>

              <button
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md flex items-center justify-center
                  ${section === 'feedback' 
                    ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                onClick={() => setSection('feedback')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Feedback
              </button>
            </div>
          </div>

          {/* Section content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6">
              {section === 'invites' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Users size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">Liste des invités</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Gérez vos invités, envoyez des invitations et suivez les RSVP.
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center">
                    <Users size={18} className="mr-2" />
                    Ajouter des invités
                  </button>
                </div>
              )}

              {section === 'planning' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CalendarIcon size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">Planning</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Organisez le déroulement de la journée et gérez les horaires.
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center">
                    <CalendarIcon size={18} className="mr-2" />
                    Créer un planning
                  </button>
                </div>
              )}

              {section === 'prestataires' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Package size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">Prestataires</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Gérez vos prestataires et leurs services pour votre cérémonie.
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center">
                    <Package size={18} className="mr-2" />
                    Ajouter un prestataire
                  </button>
                </div>
              )}

              {section === 'taches' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckSquare size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">Tâches</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Suivez vos tâches et votre checklist pour la préparation du mariage.
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center">
                    <CheckSquare size={18} className="mr-2" />
                    Créer une tâche
                  </button>
                </div>
              )}

              {section === 'feedback' && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MessageCircle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    Recueillez les commentaires et impressions sur votre cérémonie.
                  </p>
                  <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg flex items-center">
                    <MessageCircle size={18} className="mr-2" />
                    Ajouter un feedback
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate('/listceremony')}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              Retour à la liste
            </button>

            <div className="space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Modifier
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
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

export default WeddingDetails;