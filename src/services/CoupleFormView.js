import React, { useState } from 'react';
import '../styles/CoupleForm.css';
import { CheckCircle, Clock, Calendar, Users, AlertTriangle, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

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
  const [showProvidersList, setShowProvidersList] = useState(true);
  
  // États pour le timeline de mariage (section 3)
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, time: '08:00', duration: 40, title: 'Réveil et Douche', icon: '☀️', completed: false },
    { id: 2, time: '08:40', duration: 30, title: 'Petit déjeuner', icon: '🍳', completed: false },
    { id: 3, time: '09:10', duration: 120, title: 'Coiffure et maquillage', icon: '💄', completed: false },
    { id: 4, time: '11:10', duration: 30, title: 'Tout le monde s\'habille', icon: '👗', completed: false },
    { id: 5, time: '11:40', duration: 20, title: 'Déjeuner ou collation', icon: '🥪', completed: false },
    { id: 6, time: '13:15', duration: 15, title: 'Arrivée du photographe', icon: '📷', completed: false },
    { id: 7, time: '13:30', duration: 60, title: 'Séance photo', icon: '📸', completed: false },
    { id: 8, time: '14:30', duration: 15, title: 'Photos de famille', icon: '👨‍👩‍👧‍👦', completed: false }
  ]);
  
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [editTimelineForm, setEditTimelineForm] = useState({});
  const [isTimelineEditable, setIsTimelineEditable] = useState(true);
  
  // Définition des étapes
  const steps = [
    { id: 1, name: "Choix des prestataires", icon: <Users size={20} />, description: "Sélectionnez vos prestataires préférés" },
    { id: 2, name: "Planification RDV", icon: <Calendar size={20} />, description: "Organisez vos rendez-vous" },
    { id: 3, name: "Timeline & Finalisation", icon: <CheckCircle size={20} />, description: "Planifiez votre journée parfaite" }
  ];

  // Fonctions Timeline
  const toggleTimelineCompleted = (id) => {
    setTimelineEvents(timelineEvents.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  const startTimelineEdit = (event) => {
    setEditingTimelineId(event.id);
    setEditTimelineForm({ ...event });
  };

  const saveTimelineEdit = () => {
    setTimelineEvents(timelineEvents.map(event => 
      event.id === editingTimelineId ? { ...editTimelineForm } : event
    ));
    setEditingTimelineId(null);
    setEditTimelineForm({});
  };

  const cancelTimelineEdit = () => {
    setEditingTimelineId(null);
    setEditTimelineForm({});
  };

  const deleteTimelineEvent = (id) => {
    setTimelineEvents(timelineEvents.filter(event => event.id !== id));
  };

  const addNewTimelineEvent = () => {
    const newId = Math.max(...timelineEvents.map(e => e.id)) + 1;
    const newEvent = {
      id: newId,
      time: '15:00',
      duration: 30,
      title: 'Nouvel événement',
      icon: '⭐',
      completed: false
    };
    setTimelineEvents([...timelineEvents, newEvent]);
    startTimelineEdit(newEvent);
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
    return `${minutes} min`;
  };

  const timelineCompletedCount = timelineEvents.filter(event => event.completed).length;
  const timelineTotalCount = timelineEvents.length;
  const timelineProgressPercentage = timelineTotalCount > 0 ? Math.round((timelineCompletedCount / timelineTotalCount) * 100) : 0;

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
    
    if (stepId === 1) {
      setShowProvidersList(false);
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
            ) : showProvidersList && providers.length > 0 ? (
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
          
          {currentStep > 1 && !showProvidersList && (
            <button 
              className="show-providers-button"
              onClick={() => setShowProvidersList(true)}
            >
              Voir à nouveau nos prestataires sélectionnés
            </button>
          )}
          
          {currentStep === 2 && !completedSteps.includes(2) && (
            <div className="waiting-contact-container">
              <div className="elegant-message">
                <div className="decoration-top">
                  <div className="floral-border"></div>
                  <div className="ring-icon">💍</div>
                  <div className="floral-border"></div>
                </div>
                
                <div className="message-content">
                  <div className="icon-wrapper">
                    <Clock size={48} className="clock-icon" />
                  </div>
                  <h3 className="message-title">Votre planning est en préparation</h3>
                  <p className="message-text">
                    Votre Wedding Planner travaille actuellement sur l'organisation parfaite de votre journée.<br />
                    Vous recevrez très prochainement les propositions de rendez-vous.
                  </p>
                  
                  <div className="contact-info">
                    <div className="info-item">
                      <span className="info-icon">📧</span>
                      <span>contact@votre-weddingplanner.com</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📞</span>
                      <span>+33 6 12 34 56 78</span>
                    </div>
                  </div>
                </div>
                
                <div className="decoration-bottom">
                  <div className="heart-icon">❤️</div>
                  <div className="dotted-line"></div>
                  <div className="heart-icon">❤️</div>
                </div>
              </div>
              
              <button 
                className="next-step-button"
                onClick={() => requestStepCompletion(2)}
                style={{ marginTop: '20px' }}
              >
                Passer à la finalisation
              </button>
            </div>
          )}
          
          {/* NOUVELLE SECTION 3 : Timeline et Finalisation */}
          {currentStep === 3 && !completedSteps.includes(3) && (
            <div className="timeline-finalisation-section">
              <div className="timeline-header">
                <h3 className="timeline-title">
                  <span className="timeline-icon">⏰</span>
                  Déroulé de votre Grand Jour
                  <span className="timeline-icon">⏰</span>
                </h3>
                <p className="timeline-subtitle">
                  Planifiez chaque moment de votre journée parfaite. Vous pouvez modifier et personnaliser ce planning selon vos souhaits.
                </p>
              </div>

              <div className="timeline-controls">
                <div className="timeline-progress-info">
                  <span>Progression: {timelineCompletedCount}/{timelineTotalCount} ({timelineProgressPercentage}%)</span>
                  <div className="timeline-progress-bar">
                    <div 
                      className="timeline-progress-fill"
                      style={{ width: `${timelineProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="timeline-actions">
                  <label className="timeline-checkbox">
                    <input 
                      type="checkbox" 
                      checked={isTimelineEditable}
                      onChange={(e) => setIsTimelineEditable(e.target.checked)}
                    />
                    Mode édition
                  </label>
                  <button 
                    onClick={addNewTimelineEvent}
                    disabled={!isTimelineEditable}
                    className="add-event-button"
                  >
                    <Plus size={16} />
                    Ajouter un événement
                  </button>
                </div>
              </div>

              <div className="timeline-events">
                {timelineEvents.map((event) => (
                  <div key={event.id} className={`timeline-event ${event.completed ? 'completed' : ''}`}>
                    <div className="event-checkbox">
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => toggleTimelineCompleted(event.id)}
                      />
                    </div>

                    <div className="event-icon">
                      {event.icon}
                    </div>

                    <div className="event-time">
                      {editingTimelineId === event.id ? (
                        <input
                          type="time"
                          value={editTimelineForm.time || ''}
                          onChange={(e) => setEditTimelineForm({...editTimelineForm, time: e.target.value})}
                          className="timeline-input"
                        />
                      ) : (
                        event.time
                      )}
                    </div>

                    <div className="event-duration">
                      {editingTimelineId === event.id ? (
                        <input
                          type="number"
                          value={editTimelineForm.duration || ''}
                          onChange={(e) => setEditTimelineForm({...editTimelineForm, duration: parseInt(e.target.value)})}
                          className="timeline-input timeline-input-small"
                          placeholder="min"
                        />
                      ) : (
                        `Durée ${formatDuration(event.duration)}`
                      )}
                    </div>

                    <div className="event-title">
                      {editingTimelineId === event.id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            value={editTimelineForm.title || ''}
                            onChange={(e) => setEditTimelineForm({...editTimelineForm, title: e.target.value})}
                            className="timeline-input"
                            placeholder="Titre de l'événement"
                          />
                          <input
                            type="text"
                            value={editTimelineForm.icon || ''}
                            onChange={(e) => setEditTimelineForm({...editTimelineForm, icon: e.target.value})}
                            className="timeline-input timeline-input-small"
                            placeholder="Emoji"
                          />
                        </div>
                      ) : (
                        <span className={event.completed ? 'completed-text' : ''}>
                          {event.title}
                          {event.completed && <span className="completed-badge">✓ Terminé</span>}
                        </span>
                      )}
                    </div>

                    {isTimelineEditable && (
                      <div className="event-actions">
                        {editingTimelineId === event.id ? (
                          <>
                            <button onClick={saveTimelineEdit} className="save-button">
                              <Save size={16} />
                            </button>
                            <button onClick={cancelTimelineEdit} className="cancel-button">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startTimelineEdit(event)} className="edit-button">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => deleteTimelineEvent(event.id)} className="delete-button">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {timelineCompletedCount === timelineTotalCount && timelineTotalCount > 0 && (
                <div className="congratulations-message">
                  <span className="congrats-icon">🎉</span>
                  Félicitations ! Toutes les étapes de votre journée sont planifiées !
                  <span className="congrats-icon">🎉</span>
                </div>
              )}

              <div className="finalization-actions">
                <button 
                  className="next-step-button finalize-button"
                  onClick={() => requestStepCompletion(3)}
                >
                  Finaliser mon planning de mariage
                </button>
              </div>
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