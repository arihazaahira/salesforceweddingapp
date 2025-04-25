import axios from 'axios';

const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3";
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

export const getProvidersByWeddingId = async (weddingId) => {
  const response = await axios.get(
    `${INSTANCE_URL}/services/data/v60.0/query/?q=SELECT+Id,Name,Type__c,Phone__c,Status__c+FROM+Provider__c+WHERE+Wedding__c='${weddingId}'`,
    { headers }
  );
  return response.data.records;
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
