import React, { useState, useEffect } from 'react';
import {
  addProvider,
  getProvidersByWeddingId,
  deleteProvider,
  handleCoupleResponse,
  lockProvidersInSalesforce,
  getWeddingById
} from '../services/ProviderService';
import { Check, Clock, Calendar, Sparkles } from 'lucide-react';
import '../styles/ProviderList.css';

const WeddingPlannerDashboard = ({ weddingId }) => {
  // États pour gérer les prestataires et l'étape active
  const [providers, setProviders] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [providersLocked, setProvidersLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockingError, setLockingError] = useState(null); 
  const [newProvider, setNewProvider] = useState({
    Name: '',
    Type__c: '',
    Phone__c: '',
    Status__c: '',
    Couple_Response__c: '',
    Price__c: '',
    Availability__c: '',
    ServiceQuality__c: '',
    References__c: ''
  });

  const typeOptions = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];
  const statusOptions = ['Not Confirmed', 'Processing', 'Finished'];
  const coupleResponseOptions = ['Accepted', 'Refused', 'Not Precised'];

  useEffect(() => {
    fetchProviders();
    fetchWeddingLockStatus();
  }, [weddingId]);

  const fetchProviders = async () => {
    try {
      const data = await getProvidersByWeddingId(weddingId);
      setProviders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestataires :", error);
    }
  };

  const handleChange = (e) => {
    // Empêcher toute modification si la liste est verrouillée
    if (providersLocked) {
      return;
    }
    
    const { name, value } = e.target;
    setNewProvider((prev) => ({ ...prev, [name]: value }));
  };
  
  const fetchWeddingLockStatus = async () => {
    try {
      const wedding = await getWeddingById(weddingId);
      setProvidersLocked(wedding.Providers_Locked__c);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'état de verrouillage :", error);
    }
  };

  const handleAdd = async () => {
    if (providersLocked) {
      alert("La liste des prestataires est verrouillée. Ajout impossible.");
      return;
    }
    
    const requiredFields = ['Name', 'Type__c', 'Status__c', 'Couple_Response__c'];
    const missingFields = requiredFields.filter((field) => !newProvider[field]);

    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const providerToAdd = {
        ...newProvider,
        Wedding__c: weddingId
      };

      await addProvider(providerToAdd);
      setNewProvider({
        Name: '',
        Type__c: '',
        Phone__c: '',
        Status__c: '',
        Couple_Response__c: '',
        Price__c: '',
        Availability__c: '',
        ServiceQuality__c: '',
        References__c: ''
      });
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de l'ajout du prestataire :", error);
    }
  };

  const handleLockProviders = async () => {
    if (!weddingId) {
      alert('Aucun ID de mariage spécifié');
      return;
    }
  
    if (providers.length === 0) {
      alert('Vous devez ajouter au moins un prestataire avant de finaliser la liste.');
      return;
    }
  
    // Valider que tous les prestataires ont les champs requis
    const invalidProviders = providers.filter(p => 
      !p.Name || !p.Type__c || !p.Status__c || !p.Couple_Response__c
    );
  
    if (invalidProviders.length > 0) {
      alert(
        `${invalidProviders.length} prestataire(s) invalide(s).\n\n` +
        'Tous les prestataires doivent avoir :\n' +
        '- Un nom\n' +
        '- Un type de service\n' +
        '- Un statut\n' +
        '- Une réponse du couple'
      );
      return;
    }
  
    const confirmLock = window.confirm(
      "⚠️ ATTENTION ⚠️\n\n" +
      "Êtes-vous sûr de vouloir finaliser la liste des prestataires ?\n\n" +
      "Une fois finalisée :\n" +
      "• Vous ne pourrez plus ajouter ou supprimer de prestataires\n" +
      "• Un email sera automatiquement envoyé au couple\n" +
      "• Le couple aura 48 heures pour faire ses choix\n\n" +
      "Cette action est irréversible. Voulez-vous continuer ?"
    );
  
    if (!confirmLock) return;
  
    setIsLocking(true);
    setLockingError(null);
  
    try {
      const result = await lockProvidersInSalesforce(weddingId);
      
      if (result && result[0]?.success) {
        // Mettre à jour l'état de verrouillage IMMÉDIATEMENT
        setProvidersLocked(true);
        
        alert(
          '✅ Liste des prestataires finalisée avec succès !\n\n' +
          '📧 Un email a été envoyé au couple avec la liste des prestataires.\n' +
          '⏱️ Le couple a maintenant 48 heures pour faire ses choix.\n' +
          '🔒 Vous ne pouvez plus modifier la liste des prestataires.'
        );
        setActiveStep(1);
        
        // Réinitialiser le formulaire pour éviter tout problème
        setNewProvider({
          Name: '',
          Type__c: '',
          Phone__c: '',
          Status__c: '',
          Couple_Response__c: '',
          Price__c: '',
          Availability__c: '',
          ServiceQuality__c: '',
          References__c: ''
        });
      } else {
        throw new Error(result?.[0]?.message || 'Erreur inconnue lors du verrouillage');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setLockingError(error.message);
      alert(
        '❌ Erreur lors de la finalisation\n\n' +
        `${error.message}\n\n` +
        'Veuillez vérifier la console pour plus de détails.'
      );
    } finally {
      setIsLocking(false);
    }
  };

  const handleDelete = async (id) => {
    if (providersLocked) {
      alert("La liste des prestataires est verrouillée. Suppression impossible.");
      return;
    }
    
    try {
      await deleteProvider(id);
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de la suppression du prestataire :", error);
    }
  };

  const onCoupleApproval = async (selectedProviderId, type) => {
    const providersOfSameType = providers.filter(p => p.Type__c === type);
    try {
      for (const provider of providersOfSameType) {
        const response = provider.Id === selectedProviderId ? 'Accepted' : 'Refused';
        await handleCoupleResponse(provider.Id, response);
      }
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réponse du couple :", error);
    }
  };

  const providersByType = (type) => providers.filter(provider => provider.Type__c === type);

  const steps = [
    {
      id: 0,
      name: "Gestion des prestataires",
      icon: <Check size={24} />,
      description: "Ajoutez et gérez les prestataires pour le mariage"
    },
    {
      id: 1,
      name: "Réponses des couples",
      icon: <Clock size={24} />,
      description: "Attente des réponses des couples"
    },
    {
      id: 2,
      name: "Planning des RDV",
      icon: <Calendar size={24} />,
      description: "Planifiez les rendez-vous avec prestataires et couples"
    },
    {
      id: 3,
      name: "Last Wedding Touch Up",
      icon: <Sparkles size={24} />,
      description: "Finalisez les derniers détails"
    }
  ];

  return (
    <div className="wedding-planner-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Wedding Planner</h2>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`step-item ${
                activeStep === index 
                  ? 'active-step' 
                  : activeStep > index 
                    ? 'completed-step' 
                    : 'inactive-step'
              }`}
            >
              <div className="step-icon">
                {step.icon}
              </div>
              <div>
                <div className="step-name">{step.name}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeStep === 0 && (
          <div className="provider-section">
            <h2>Gestion des prestataires</h2>
            
            {!providersLocked ? (
              <div className="add-provider-container">
                <div className="add-provider-header">
                  <h3>Ajouter un prestataire</h3>
                  <button 
                    onClick={handleLockProviders}
                    className="lock-providers-button"
                    disabled={isLocking}
                  >
                    {isLocking ? 'Finalisation en cours...' : 'Finaliser la liste des prestataires'}
                  </button>
                </div>
                <div className="provider-form-grid">
                  <div className="form-group">
                    <label>Nom du prestataire</label>
                    <input
                      type="text"
                      name="Name"
                      placeholder="Nom du prestataire"
                      value={newProvider.Name}
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type de service</label>
                    <select 
                      name="Type__c" 
                      value={newProvider.Type__c} 
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    >
                      <option value="">Type de service</option>
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      name="Phone__c"
                      placeholder="Téléphone"
                      value={newProvider.Phone__c}
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select 
                      name="Status__c" 
                      value={newProvider.Status__c} 
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    >
                      <option value="">Statut</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Prix estimé</label>
                    <input
                      type="number"
                      name="Price__c"
                      placeholder="Prix estimé"
                      value={newProvider.Price__c}
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    />
                  </div>

                  <div className="form-group">
                    <label>Disponibilité</label>
                    <input
                      type="date"
                      name="Availability__c"
                      value={newProvider.Availability__c}
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualité du service</label>
                    <div className="rating-container">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="rating-option">
                          <input
                            type="radio"
                            name="ServiceQuality__c"
                            value={star}
                            checked={newProvider.ServiceQuality__c === star.toString()}
                            onChange={handleChange}
                            disabled={providersLocked || isLocking}
                          />
                          {star}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Références (URL)</label>
                    <input
                      type="url"
                      name="References__c"
                      placeholder="Références (URL)"
                      value={newProvider.References__c}
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    />
                  </div>

                  <div className="form-group">
                    <label>Réponse du couple</label>
                    <select 
                      name="Couple_Response__c" 
                      value={newProvider.Couple_Response__c} 
                      onChange={handleChange}
                      disabled={providersLocked || isLocking}
                    >
                      <option value="">Réponse du couple</option>
                      {coupleResponseOptions.map((response) => (
                        <option key={response} value={response}>{response}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="add-provider-button-container">
                  <button 
                    className="add-provider-button"
                    onClick={handleAdd}
                    disabled={providersLocked || isLocking}
                  >
                    {providersLocked ? 'Liste verrouillée' : 'Ajouter le prestataire'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="locked-notification">
                <div className="locked-notification-content">
                  <span>🔒 La liste des prestataires a été finalisée. Vous ne pouvez plus ajouter de prestataires.</span>
                </div>
              </div>
            )}

            <div className="providers-list-container">
              <h3>Liste des prestataires</h3>
              {providers.length === 0 ? (
                <p>Aucun prestataire pour le moment.</p>
              ) : (
                <div>
                  {typeOptions.map((type) => {
                    const filteredProviders = providersByType(type);
                    return (
                      filteredProviders.length > 0 && (
                        <div key={type} className="provider-type-section">
                          <h4>{type}</h4>
                          <div className="providers-table-container">
                            <table className="providers-table">
                              <thead>
                                <tr>
                                  <th>Nom</th>
                                  <th>Type</th>
                                  <th>Téléphone</th>
                                  <th>Statut</th>
                                  <th>Prix</th>
                                  <th>Disponibilité</th>
                                  <th>Note</th>
                                  <th>Références</th>
                                  <th>Réponse du couple</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredProviders.map((provider) => (
                                  <tr key={provider.Id}>
                                    <td>{provider.Name}</td>
                                    <td>{provider.Type__c}</td>
                                    <td>{provider.Phone__c}</td>
                                    <td>{provider.Status__c}</td>
                                    <td>{provider.Price__c ? `${provider.Price__c} MAD` : '-'}</td>
                                    <td>{provider.Availability__c || '-'}</td>
                                    <td>{provider.ServiceQuality__c ? `${provider.ServiceQuality__c} / 5` : '-'}</td>
                                    <td>
                                      {provider.References__c ? (
                                        <a href={provider.References__c} target="_blank" rel="noopener noreferrer" className="reference-link">Lien</a>
                                      ) : '-'}
                                    </td>
                                    <td>
                                      <span className={`couple-response ${
                                        provider.Couple_Response__c === 'Accepted' ? 'accepted' :
                                        provider.Couple_Response__c === 'Refused' ? 'refused' :
                                        'not-precised'
                                      }`}>
                                        {provider.Couple_Response__c || 'Not Precised'}
                                      </span>
                                    </td>
                                    <td>
                                      <button 
                                        onClick={() => handleDelete(provider.Id)}
                                        className="delete-button"
                                        disabled={providersLocked}
                                        title={providersLocked ? "Liste verrouillée - suppression impossible" : "Supprimer ce prestataire"}
                                      >
                                        {providersLocked ? 'Verrouillé' : 'Supprimer'}
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <h2>Réponses des couples</h2>
            <div className="couple-responses-container">
              <p>Cette section affichera l'état des réponses des couples concernant les prestataires proposés.</p>
              
              <div className="responses-grid">
                {providers.length > 0 ? (
                  typeOptions.map((type) => {
                    const typeProviders = providersByType(type);
                    if (typeProviders.length === 0) return null;
                    
                    return (
                      <div key={type} className="response-card">
                        <h3>{type}</h3>
                        <div className="providers-list">
                          {typeProviders.map(provider => (
                            <div key={provider.Id} className="provider-response-item">
                              <span>{provider.Name}</span>
                              <span className={`couple-response ${
                                provider.Couple_Response__c === 'Accepted' ? 'accepted' :
                                provider.Couple_Response__c === 'Refused' ? 'refused' :
                                'not-precised'
                              }`}>
                                {provider.Couple_Response__c || 'Not Precised'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Aucun prestataire n'a été ajouté.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h2>Planning des rendez-vous</h2>
            <div className="appointments-container">
              <p>Cette section permettra de planifier les rendez-vous avec les prestataires et les couples.</p>
              
              <div className="accepted-providers-section">
                <h3>Prestataires acceptés</h3>
                {providers.filter(p => p.Couple_Response__c === 'Accepted').length > 0 ? (
                  <div className="providers-grid">
                    {providers
                      .filter(p => p.Couple_Response__c === 'Accepted')
                      .map(provider => (
                        <div key={provider.Id} className="provider-card">
                          <div className="provider-name">{provider.Name}</div>
                          <div className="provider-type">{provider.Type__c}</div>
                          <div className="provider-phone">Téléphone: {provider.Phone__c || 'Non spécifié'}</div>
                          <div className="provider-availability">Disponibilité: {provider.Availability__c || 'Non spécifiée'}</div>
                          <div className="schedule-button-container">
                            <button className="schedule-button">
                              Planifier un RDV
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p>Aucun prestataire n'a encore été accepté par le couple.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div>
            <h2>Last Wedding Touch Up</h2>
            <div className="final-touch-container">
              <p>Cette section concernera les dernières touches à apporter au mariage avant le jour J.</p>
              
              <div className="summary-section">
                <h3>Récapitulatif final</h3>
                <div className="summary-cards">
                  <div className="confirmed-card">
                    <h4>Prestataires confirmés</h4>
                    {providers.filter(p => p.Status__c === 'Finished' && p.Couple_Response__c === 'Accepted').length > 0 ? (
                      <ul className="providers-summary-list">
                        {providers
                          .filter(p => p.Status__c === 'Finished' && p.Couple_Response__c === 'Accepted')
                          .map(provider => (
                            <li key={provider.Id} className="provider-summary-item">
                              <span>{provider.Name} ({provider.Type__c})</span>
                              <span className="confirmed-status">Confirmé</span>
                            </li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className="no-providers-message">Aucun prestataire n'est encore totalement confirmé.</p>
                    )}
                  </div>
                  
                  <div className="pending-card">
                    <h4>Prestataires en attente</h4>
                    {providers.filter(p => p.Status__c === 'Processing' && p.Couple_Response__c === 'Accepted').length > 0 ? (
                      <ul className="providers-summary-list">
                        {providers
                          .filter(p => p.Status__c === 'Processing' && p.Couple_Response__c === 'Accepted')
                          .map(provider => (
                            <li key={provider.Id} className="provider-summary-item">
                              <span>{provider.Name} ({provider.Type__c})</span>
                              <span className="pending-status">En cours</span>
                            </li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className="no-providers-message">Aucun prestataire n'est en attente de confirmation.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeddingPlannerDashboard;