import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CoupleFormView from '../services/CoupleFormView.js';

// Configuration Salesforce
const SALESFORCE_CONFIG = {
  accessToken: "00DgK0000029e5F!AQEAQIc6j2fYobq7ThIDoFB_G4y3PcYu_qF7ABPksr6fG.dPqSanv8D_62IBvKlXzw2ntvCjrh1UAsQpLRAXY15c_hf74zek",
  instanceUrl: 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com',
};

// Types de prestataires
const PROVIDER_TYPES = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];

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
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupleId = async (coupleName) => {
    const query = `SELECT Id FROM Couple__c WHERE Couple_Name__c = '${encodeURIComponent(coupleName)}'`;
    const response = await executeQuery(query);
    
    if (!response.records?.length) {
      throw new Error('Couple non trouvé');
    }
    
    return response.records[0].Id;
  };

  const fetchWeddingId = async (coupleId) => {
    const query = `SELECT Id FROM Wedding__c WHERE Couple_Name__c = '${coupleId}'`;
    const response = await executeQuery(query);
    
    if (!response.records?.length) {
      throw new Error('Aucun mariage trouvé pour ce couple');
    }
    
    return response.records[0].Id;
  };

  const fetchProviders = async (weddingId) => {
    const query = `SELECT Id, Name, Type__c, Price__c, Availability__c, 
                   Status__c, Couple_Response__c, Phone__c, ServiceQuality__c, References__c
                   FROM Provider__c WHERE Wedding__c = '${weddingId}'`;
    const response = await executeQuery(query);
    return response.records || [];
  };

  const executeQuery = async (soqlQuery) => {
    const response = await fetch(
      `${SALESFORCE_CONFIG.instanceUrl}/services/data/v56.0/query?q=${encodeURIComponent(soqlQuery)}`,
      {
        headers: {
          'Authorization': `Bearer ${SALESFORCE_CONFIG.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return await response.json();
  };

  const updateProviderResponse = async (providerId, response) => {
    try {
      // Mettre à jour le provider dans Salesforce
      await updateProviderInSalesforce(providerId, { Couple_Response__c: response });
      
      // Si la réponse est "Accepted", refuser les autres providers du même type
      if (response === 'Accepted') {
        const provider = providers.find(p => p.Id === providerId);
        const sameTypeProviders = providers.filter(p => 
          p.Type__c === provider.Type__c && p.Id !== providerId
        );
        
        for (const p of sameTypeProviders) {
          await updateProviderInSalesforce(p.Id, { Couple_Response__c: 'Refused' });
        }
      }
      
      // Rafraîchir la liste
      fetchProviders(weddingId).then(setProviders);
      
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la mise à jour:', err);
    }
  };

  const updateProviderInSalesforce = async (providerId, fields) => {
    const response = await fetch(
      `${SALESFORCE_CONFIG.instanceUrl}/services/data/v56.0/sobjects/Provider__c/${providerId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SALESFORCE_CONFIG.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      }
    );
    
    if (!response.ok) {
      throw new Error('Échec de la mise à jour');
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