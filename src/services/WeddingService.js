import axios from 'axios';
const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQKDalq.vpvXfvev8pGGaHDMM3x7cKeMvRDMFaMYnENTEq2P4pTQnLOSqMEJng1JKECY9XHzaeJMJ8zZNCQrmKDFvcj0m";
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

export const getWeddingById = async (id) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v55.0/sobjects/Wedding__c/${id}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur dans getWeddingById:', error.response?.data || error.message);
    throw error;
  }
};
