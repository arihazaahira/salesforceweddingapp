import axios from 'axios';
const ACCESS_TOKEN=process.env.REACT_APP_SF_ACCESS_TOKEN;
const INSTANCE_URL=process.env.REACT_APP_SF_INSTANCE_URL;

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
