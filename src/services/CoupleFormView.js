import React from 'react';
import '../styles/CoupleForm.css';

const CoupleFormView = ({
  coupleName,
  providers,
  providerTypes,
  loading,
  error,
  onRetry,
  onResponseChange
}) => {
  // Fonction pour grouper les prestataires par type
  const getProvidersByType = (type) => {
    return providers.filter(provider => provider.Type__c === type);
  };

  // Options pour la réponse du couple
  const responseOptions = ['Not Precised', 'Accepted', 'Refused'];

  return (
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
                                onChange={(e) => onResponseChange(provider.Id, e.target.value)}
                                className="response-select"
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
        
        <div className="floating-emojis">
          <span className="floating-emoji">💍</span>
          <span className="floating-emoji">👰</span>
          <span className="floating-emoji">🤵</span>
          <span className="floating-emoji">🎉</span>
        </div>
      </div>
    </div>
  );
};

export default CoupleFormView;