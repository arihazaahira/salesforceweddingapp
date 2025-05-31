import axios from 'axios';


const ACCESS_TOKEN=process.env.REACT_APP_SF_ACCESS_TOKEN;
const INSTANCE_URL=process.env.REACT_APP_SF_INSTANCE_URL;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

// Helper function to handle errors
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, {
    status: error.response?.status,
    message: error.response?.data || error.message,
    config: error.config
  });
  throw error;
};

export const addProvider = async (providerData) => {
  try {
    // Ensure required fields are present
    const requiredFields = ['Name', 'Type__c', 'Wedding__c'];
    const missingFields = requiredFields.filter(field => !providerData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c`,
      providerData,
      { headers }
    );
    return response.data;
  } catch (error) {
    handleError(error, 'addProvider');
  }
};

export const deleteProvider = async (providerId) => {
  try {
    await axios.delete(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      { headers }
    );
    return true;
  } catch (error) {
    handleError(error, 'deleteProvider');
  }
};

export const handleCoupleResponse = async (providerId, responseValue) => {
  try {
    const response = await axios.patch(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      { Couple_Response__c: responseValue },
      { headers }
    );
    return response.data;
  } catch (error) {
    handleError(error, 'handleCoupleResponse');
  }
};

export const getProvidersByWeddingId = async (weddingId) => {
  try {
    const query = `SELECT Id,Name,Type__c,Phone__c,Status__c,Couple_Response__c,Price__c,Availability__c,ServiceQuality__c,References__c,Wedding__c 
                   FROM Provider__c 
                   WHERE Wedding__c='${weddingId}'`;
    
    const encodedQuery = encodeURIComponent(query);
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/query/?q=${encodedQuery}`,
      { headers }
    );
    return response.data.records;
  } catch (error) {
    handleError(error, 'getProvidersByWeddingId');
  }
};

export const lockProvidersInSalesforce = async (weddingId) => {
  try {
    // 1. First lock the wedding
    await axios.patch(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Wedding__c/${weddingId}`,
      { Providers_Locked__c: true },
      { headers }
    );

    // 2. Then trigger the flow
    const flowResponse = await axios.post(
      `${INSTANCE_URL}/services/data/v60.0/actions/custom/flow/Couple_s_Choice_of_Providers`,
      {
        inputs: [{
          weddingId: weddingId
        }]
      },
      { headers }
    );

    return flowResponse.data;
  } catch (error) {
    handleError(error, 'lockProvidersInSalesforce');
  }
};