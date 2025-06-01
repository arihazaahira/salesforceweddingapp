import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import '../styles/CoupleForm.css';

const ProviderValidationPage = ({ marriageId, token }) => {
  const [providers, setProviders] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coupleName, setCoupleName] = useState('');
  const [validationStatus, setValidationStatus] = useState('pending');
  const [expiryDate, setExpiryDate] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (marriageId && token) {
      checkValidationStatus();
    } else {
      setError('Paramètres de validation manquants');
      setLoading(false);
    }
  }, [marriageId, token]);

  useEffect(() => {
    if (expiryDate && validationStatus === 'pending') {
      const timer = setInterval(() => {
        updateTimeRemaining();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [expiryDate, validationStatus]);

  const checkValidationStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/weddingPlanner/validateStatus`, {
        params: { marriageId, token }
      });

      if (response.data.success) {
        setValidationStatus(response.data.status.toLowerCase());
        setExpiryDate(new Date(response.data.expiryDate));
        setCoupleName(response.data.coupleName || '');

        if (response.data.status.toLowerCase() === 'pending') {
          loadProviders();
        }
      } else {
        setError(response.data.message);
        setValidationStatus('error');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setValidationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      const response = await axios.get(`/api/weddingPlanner/providers`, {
        params: { marriageId, token }
      });

      if (response.data.success) {
        setProviders(response.data.providers);
        const types = [...new Set(response.data.providers.map(p => p.Type__c))];
        setProviderTypes(types);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const updateTimeRemaining = () => {
    if (!expiryDate) return;
    const now = new Date();
    const diff = expiryDate - now;

    if (diff <= 0) {
      setTimeRemaining('00:00:00');
      setValidationStatus('expired');
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeRemaining(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    );
  };

  const handleResponseChange = (providerId, value) => {
    setProviders(
      providers.map(provider =>
        provider.Id === providerId
          ? { ...provider, Couple_Response__c: value }
          : provider
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const choices = providers.map(provider => ({
        id: provider.Id,
        response: provider.Couple_Response__c || 'Not Precised'
      }));

      const response = await axios.post(`/api/weddingPlanner/validateChoices`, {
        marriageId,
        token,
        choices
      });

      if (response.data.success) {
        setValidationStatus('validated');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProvidersByType = (type) => {
    return providers.filter(provider => provider.Type__c === type);
  };

  const responseOptions = ['Not Precised', 'Accepted', 'Refused'];

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Chargement en cours...</div>;
    }

    if (error) {
      return (
        <div className="error-container">
          <AlertCircle size={48} className="error-icon" />
          <h2>Erreur</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (validationStatus === 'expired') {
      return (
        <div className="expired-container">
          <Clock size={48} className="expired-icon" />
          <h2>Le délai de validation a expiré</h2>
          <p>Nous sommes désolés, mais le délai de 48 heures pour valider vos choix est écoulé.</p>
          <p>Veuillez contacter votre wedding planner pour plus d'informations.</p>
        </div>
      );
    }

    if (validationStatus === 'validated') {
      return (
        <div className="validated-container">
          <CheckCircle size={48} className="validated-icon" />
          <h2>Validation confirmée</h2>
          <p>Merci ! Vos choix de prestataires ont été validés avec succès.</p>
          <p>Votre wedding planner a été informé de vos décisions.</p>
        </div>
      );
    }

    return (
      <div className="providers-container">
        <div className="countdown-container">
          <h3>Temps restant pour valider vos choix :</h3>
          <div className="countdown">{timeRemaining}</div>
          <p className="expiry-info">Expire le {expiryDate?.toLocaleString() || ''}</p>
        </div>

        {providers.length > 0 ? (
          <div className="providers-content">
            {providerTypes.map(type => {
              const typeProviders = getProvidersByType(type);

              return typeProviders.length > 0 && (
                <div key={type} className="provider-type-section">
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
                        <th>Votre réponse</th>
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
                          <td>{provider.ServiceQuality__c ? `${provider.ServiceQuality__c}/5` : 'N/A'}</td>
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

            <div className="validation-actions">
              <button className="validate-button" onClick={openConfirmModal}>
                Valider mes choix
              </button>
              <p className="validation-note">
                Attention : Une fois validés, vos choix ne pourront plus être modifiés.
              </p>
            </div>
          </div>
        ) : (
          <div className="no-providers">
            <p>Aucun prestataire trouvé pour votre mariage.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="provider-validation-page">
      <header className="validation-header">
        <h1><span className="heart-emoji">❤️</span> Validation des prestataires <span className="heart-emoji">❤️</span></h1>
        <h2>{coupleName ? `Bonjour, ${coupleName}` : 'Bonjour'}</h2>
      </header>

      <main className="validation-content">{renderContent()}</main>

      {showConfirmModal && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmation de validation</h3>
              <button className="close-button" onClick={closeConfirmModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Attention :</strong> Vous êtes sur le point de valider définitivement vos choix de prestataires.
              </p>
              <p>Une fois cette action effectuée, vous ne pourrez plus modifier vos choix.</p>
              <p>Êtes-vous sûr(e) de vouloir continuer ?</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeConfirmModal}>
                Annuler
              </button>
              <button className="confirm-button" onClick={handleSubmit}>
                Confirmer et valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderValidationPage;
