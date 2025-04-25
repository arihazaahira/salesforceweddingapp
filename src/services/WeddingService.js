import axios from 'axios';

const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQC4pveIoGVB.Ot2IGwkNkFk1_3WeO4QF6BLUN9J8SYoVRFuIXiZmrScH6wmjkqRpNnBA82NV4N4sNKvQHQsK6oSghkXk';
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
