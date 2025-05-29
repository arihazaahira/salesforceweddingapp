import axios from 'axios';


const ACCESS_TOKEN=process.env.REACT_APP_SF_ACCESS_TOKEN;
const INSTANCE_URL=process.env.REACT_APP_SF_INSTANCE_URL;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};


export const addProvider = async (providerData) => {
  const response = await axios.post(
    `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c`,
    providerData,
    { headers }
  );
  return response.data;
};

export const deleteProvider = async (providerId) => {
  const response = await axios.delete(
    `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
    { headers }
  );
  return response.status === 204;
};

// Fonction utilitaire
const updateCoupleResponse = async (providerId, responseValue) => {
  const body = {
    Couple_Response__c: responseValue
  };

  const responseUpdate = await axios.patch(
    `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
    body,
    { headers }
  );

  return responseUpdate.data;
};

// Fonction exportée pour React
export const handleCoupleResponse = async (providerId, responseValue) => {
  try {
    return await updateCoupleResponse(providerId, responseValue);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réponse du couple :', error);
    throw error;
  }
};

export const getProvidersByWeddingId = async (weddingId) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/query/?q=SELECT+Id,Name,Type__c,Phone__c,Status__c,Couple_Response__c,Price__c,Availability__c,ServiceQuality__c,References__c,Wedding__c+FROM+Provider__c+WHERE+Wedding__c='${weddingId}'`,
      { headers }
    );
    return response.data.records;
  } catch (error) {
    console.error('Error fetching providers by wedding ID:', error.response?.data || error.message);
    throw error;
  }
};

export const getProvidersById = async (providerId) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      url: `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to fetch provider: ${error.response?.data?.message || error.message}`);
  }
};
