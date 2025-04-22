import axios from 'axios';

const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQIWs0qUMxkBeYKlOgR0GuB2lKXkn4pDjIebwTPQEfUt4pTCMramhf1mqYiedQQaZjtkqvJK.ltXMq27ErE_mDQO51UvZ';
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
