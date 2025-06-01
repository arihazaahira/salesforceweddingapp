import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CoupleFormView from '../services/CoupleFormView.js';

// Configuration Salesforce
const SALESFORCE_CONFIG = {
  instanceUrl: process.env.REACT_APP_SF_INSTANCE_URL,
  apiVersion: 'v56.0',
  accessToken: process.env.REACT_APP_SF_ACCESS_TOKEN,
};

// Types de prestataires
const PROVIDER_TYPES = [
  'DJ',
  'Dresser',
  'Logistics provider',
  'Makeup Artist',
  'Food Provider',
  'Flower Provider',
];

function CoupleForm() {
  const location = useLocation();
  const { coupleName } = location.state || {};
  const [weddingId, setWeddingId] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (coupleName) {
      fetchWeddingAndProviders();
    } else {
      setError('Nom du couple manquant. Veuillez vous reconnecter.');
    }
  }, [coupleName]);

  const fetchWeddingAndProviders = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Trouver le couple par son nom
      const coupleId = await fetchCoupleId(coupleName);

      // 2. Trouver le mariage associé à ce couple
      const weddingId = await fetchWeddingId(coupleId);
      setWeddingId(weddingId);

      // 3. Récupérer les prestataires associés à ce mariage
      const providersData = await fetchProviders(weddingId);
      setProviders(providersData);
    } catch (err) {
      setError(err.message || 'Erreur inattendue.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupleId = async (coupleName) => {
    const query = `SELECT Id FROM Couple__c WHERE Couple_Name__c = '${coupleName}'`;
    const response = await executeQuery(query);

    if (!response.records?.length) {
      throw new Error('Couple non trouvé.');
    }

    return response.records[0].Id;
  };

  const fetchWeddingId = async (coupleId) => {
    const query = `SELECT Id FROM Wedding__c WHERE Couple_Name__c = '${coupleId}'`;
    const response = await executeQuery(query);

    if (!response.records?.length) {
      throw new Error('Aucun mariage trouvé pour ce couple.');
    }

    return response.records[0].Id;
  };

  const fetchProviders = async (weddingId) => {
    const query = `
      SELECT Id, Name, Type__c, Price__c, Availability__c, 
             Status__c, Couple_Response__c, Phone__c, 
             ServiceQuality__c, References__c
      FROM Provider__c 
      WHERE Wedding__c = '${weddingId}'
    `;
    const response = await executeQuery(query);
    return response.records || [];
  };

  const executeQuery = async (soqlQuery) => {
    const response = await fetch(
      `${SALESFORCE_CONFIG.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/query?q=${encodeURIComponent(
        soqlQuery
      )}`,
      {
        headers: {
          Authorization: `Bearer ${SALESFORCE_CONFIG.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  };

  const updateProviderResponse = async (providerId, response) => {
    try {
      await updateProviderInSalesforce(providerId, {
        Couple_Response__c: response,
      });

      if (response === 'Accepted') {
        const provider = providers.find((p) => p.Id === providerId);
        const sameTypeProviders = providers.filter(
          (p) => p.Type__c === provider.Type__c && p.Id !== providerId
        );

        for (const p of sameTypeProviders) {
          await updateProviderInSalesforce(p.Id, {
            Couple_Response__c: 'Refused',
          });
        }
      }

      // Rafraîchir la liste
      const updatedProviders = await fetchProviders(weddingId);
      setProviders(updatedProviders);
    } catch (err) {
      setError('Erreur lors de la mise à jour : ' + err.message);
    }
  };

  const updateProviderInSalesforce = async (providerId, fields) => {
    const response = await fetch(
      `${SALESFORCE_CONFIG.instanceUrl}/services/data/${SALESFORCE_CONFIG.apiVersion}/sobjects/Provider__c/${providerId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${SALESFORCE_CONFIG.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      }
    );

    if (!response.ok) {
      throw new Error('Échec de la mise à jour du prestataire.');
    }
  };

  return (
    <CoupleFormView
      coupleName={coupleName}
      providers={providers}
      providerTypes={PROVIDER_TYPES}
      loading={loading}
      error={error}
      onRetry={fetchWeddingAndProviders}
      onResponseChange={updateProviderResponse}
    />
  );
}

export default CoupleForm;
