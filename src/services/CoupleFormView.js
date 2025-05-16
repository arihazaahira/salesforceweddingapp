import React, { useState } from 'react';
import '../styles/CoupleForm.css';
import { CheckCircle, Clock, Calendar, Users, AlertTriangle } from 'lucide-react';

const CoupleFormView = ({
  coupleName,
  providers,
  providerTypes,
  loading,
  error,
  onRetry,
  onResponseChange
}) => {
  // État des étapes du processus
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [stepToComplete, setStepToComplete] = useState(null);

  // Définition des étapes
  const steps = [
    { id: 1, name: "Choix des prestataires", icon: <Users size={20} />, description: "Sélectionnez vos prestataires préférés" },
    { id: 2, name: "Attente des réponses", icon: <Clock size={20} />, description: "En attente de confirmation des prestataires" },
    { id: 3, name: "Planification RDV", icon: <Calendar size={20} />, description: "Organisez vos rendez-vous" },
    { id: 4, name: "Finalisation", icon: <CheckCircle size={20} />, description: "Validez vos choix définitifs" }
  ];

  // Fonction pour demander la confirmation avant de compléter une étape
  const requestStepCompletion = (stepId) => {
    setStepToComplete(stepId);
    setShowConfirmModal(true);
  };

  // Fonction pour compléter une étape après confirmation
  const completeStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
    
    setShowConfirmModal(false);
  };

  // Fonction pour annuler la validation d'étape
  const cancelStepCompletion = () => {
    setShowConfirmModal(false);
    setStepToComplete(null);
  };

  // Fonction pour grouper les prestataires par type
  const getProvidersByType = (type) => {
    return providers.filter(provider => provider.Type__c === type);
  };

  // Options pour la réponse du couple
  const responseOptions = ['Not Precised', 'Accepted', 'Refused'];

  // Fonction pour gérer la réponse modifiée avec validation d'étape
  const handleResponseChange = (providerId, value) => {
    onResponseChange(providerId, value);
  };

  return (
    <div className="coupleform-layout">
      {/* Sidebar de progression */}
      <div className="coupleform-sidebar">
        <div className="sidebar-header">
          <h3>Votre Progression</h3>
        </div>
        <div className="sidebar-steps">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`sidebar-step ${completedSteps.includes(step.id) ? 'completed' : ''} ${currentStep === step.id ? 'active' : ''}`}
            >
              <div className="step-indicator">
                {completedSteps.includes(step.id) ? (
                  <CheckCircle size={24} className="step-icon completed" />
                ) : (
                  <div className="step-number">{step.id}</div>
                )}
              </div>
              <div className="step-content">
                <div className="step-title">{step.name}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="sidebar-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="coupleform-container">
        <div className="coupleform-content animate__animated animate__fadeIn">
          <h2 className="coupleform-title">
            <span className="heart-emoji">❤️</span> Bonjour, {coupleName || 'Cher couple'} ! <span className="heart-emoji">❤️</span>
          </h2>
          <p className="coupleform-subtitle">Vos prestataires de service</p>
          
          <div className="providers-section">
            {loading ? (
              <div className="loading-message">Chargement en cours...</div>
            ) : error ? (
              <div className="error-message">
                <p>Erreur: {error}</p>
                <button onClick={onRetry} className="retry-button">
                  Réessayer
                </button>
              </div>
            ) : providers.length > 0 ? (
              <div className="providers-by-type">
                {providerTypes.map(type => {
                  const typeProviders = getProvidersByType(type);
                  
                  return typeProviders.length > 0 && (
                    <div key={type} className="provider-type-card">
                      <h3 className="provider-type-title">{type}</h3>
                      
                      <table className="providers-table">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Téléphone</th>
                            <th>Prix</th>
                            <th>Disponibilité</th>
                            <th>Statut</th>
                            <th>Qualité</th>
                            <th>Références</th>
                            <th>Réponse</th>
                          </tr>
                        </thead>
                        <tbody>
                          {typeProviders.map(provider => (
                            <tr key={provider.Id}>
                              <td>{provider.Name}</td>
                              <td>{provider.Phone__c || 'N/A'}</td>
                              <td>{provider.Price__c ? `${provider.Price__c} €` : 'N/A'}</td>
                              <td>
                                {provider.Availability__c 
                                  ? new Date(provider.Availability__c).toLocaleDateString('fr-FR') 
                                  : 'N/A'}
                              </td>
                              <td>{provider.Status__c || 'N/A'}</td>
                              <td>
                                {provider.ServiceQuality__c 
                                  ? `${provider.ServiceQuality__c}/5` 
                                  : 'N/A'}
                              </td>
                              <td>
                                {provider.References__c ? (
                                  <a href={provider.References__c} target="_blank" rel="noopener noreferrer">
                                    Voir
                                  </a>
                                ) : 'N/A'}
                              </td>
                              <td>
                                <select
                                  value={provider.Couple_Response__c || 'Not Precised'}
                                  onChange={(e) => handleResponseChange(provider.Id, e.target.value)}
                                  className="response-select"
                                  disabled={completedSteps.includes(1)}
                                >
                                  {responseOptions.map(option => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-providers">
                <p>Aucun prestataire trouvé pour votre mariage.</p>
                <button onClick={onRetry} className="retry-button">
                  Actualiser
                </button>
              </div>
            )}
          </div>
          
          {currentStep === 1 && providers.length > 0 && !completedSteps.includes(1) && (
            <div className="step-actions">
              <button 
                className="next-step-button"
                onClick={() => requestStepCompletion(1)}
              >
                Valider mes choix
              </button>
            </div>
          )}
          
          {/* Instructions pour l'étape courante */}
          {currentStep === 2 && !completedSteps.includes(2) && (
            <div className="step-instructions">
              <h3>Étape en cours : Attente des réponses</h3>
              <p>Nous avons contacté les prestataires sélectionnés et attendons leurs réponses. Vous serez notifié(e)s dès qu'un prestataire aura répondu.</p>
              
              {/* Simuler que certains prestataires ont déjà répondu */}
              <div className="interim-status">
                <h4>Statut des réponses :</h4>
                <ul className="response-status-list">
                  <li><span className="status-dot received"></span> Reçues : 2</li>
                  <li><span className="status-dot pending"></span> En attente : 3</li>
                </ul>
                
                <button 
                  className="next-step-button"
                  onClick={() => requestStepCompletion(2)}
                >
                  Passer à l'étape suivante
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && !completedSteps.includes(3) && (
            <div className="step-instructions">
              <h3>Étape en cours : Planification des rendez-vous</h3>
              <p>Planifiez vos rendez-vous avec les prestataires qui ont accepté votre demande.</p>
              
              <div className="meetings-calendar">
                <h4>Calendrier des rendez-vous :</h4>
                <div className="calendar-placeholder">
                  {/* Ici viendrait un composant calendrier pour planifier les RDV */}
                  <p className="calendar-info">Le calendrier de planification n'est pas encore implémenté.</p>
                </div>
                
                <button 
                  className="next-step-button"
                  onClick={() => requestStepCompletion(3)}
                >
                  Confirmer les rendez-vous
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 4 && !completedSteps.includes(4) && (
            <div className="step-instructions">
              <h3>Étape finale : Finalisation</h3>
              <p>Félicitations ! Vous avez presque terminé. Confirmer vos choix finaux de prestataires.</p>
              
              <button 
                className="next-step-button"
                onClick={() => requestStepCompletion(4)}
              >
                Finaliser mon événement
              </button>
            </div>
          )}
          
          {/* Fenêtre modale de confirmation */}
          {showConfirmModal && (
            <div className="confirmation-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <AlertTriangle size={24} className="warning-icon" />
                  <h3>Confirmation requise</h3>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Attention :</strong> Vous êtes sur le point de valider l'étape "{steps.find(s => s.id === stepToComplete)?.name}".
                  </p>
                  <p>Une fois cette étape validée, vous ne pourrez plus revenir en arrière ni modifier vos choix précédents.</p>
                  <p>Êtes-vous sûr(e) de vouloir continuer ?</p>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={cancelStepCompletion}>
                    Annuler
                  </button>
                  <button className="confirm-button" onClick={() => completeStep(stepToComplete)}>
                    Confirmer et continuer
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="floating-emojis">
            <span className="floating-emoji">💍</span>
            <span className="floating-emoji">👰</span>
            <span className="floating-emoji">🤵</span>
            <span className="floating-emoji">🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoupleFormView;