import axios from 'axios';

const ACCESS_TOKEN="00DgK0000029e5F!AQEAQJkTtRAffTcCUqbYXvB.Svdgjb2BfRUhD2qOZBW8gvjyn0Cvy_8pKZlQBLm8Ww.xP.pZcahtonXAuKaUSm.Ed2Az8PB0";
const INSTANCE_URL='https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

export const getProvidersByWeddingId = async (weddingId) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/query/?q=SELECT+Id,Name,Type__c,Phone__c,Status__c,Couple_Response__c,Price__c,Availability__c,ServiceQuality__c,References__c,Wedding__c+FROM+Provider__c+WHERE+Wedding__c='${weddingId}'`,
      { headers }
    );
    return response.data.records;
  } catch (error) {
    console.error('Erreur lors de la récupération des prestataires par ID de mariage :', error.response?.data || error.message);
    throw error;
  }
};

export const handleCoupleResponse = async (providerId, responseValue) => {
  try {
    const body = {
      Couple_Response__c: responseValue
    };

    const responseUpdate = await axios.patch(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Provider__c/${providerId}`,
      body,
      { headers }
    );

    return responseUpdate.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réponse du couple :', error);
    throw error;
  }
};