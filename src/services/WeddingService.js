import axios from 'axios';
const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQD8Glm7qvNhnz2l7LT1k4fBQB6o4od.dJyYNLrrT.wZF78YKPX4gR9xRqSDc9PEZu8BUUW5uG9h9Qp3zrdZd4hqlBIiA";
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
