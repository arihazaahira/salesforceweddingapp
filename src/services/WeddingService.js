import axios from 'axios';

const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQCtKbybt1PNp5FffJ01T.ZUoq5gvtbaqVydtw1ZWvjSzMunNMwmV28OoPa.GARJT22xeoSKEMA2Y6WGKIAYhZxLP8Q4.';
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
