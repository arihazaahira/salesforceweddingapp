import axios from 'axios';

const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQDxbpzPXGpLawTnf6qCtgUy6tzT5rGACyY0zB5E.Q7Ps6Z.Dxg2SlIQw0IpTPOdyu7SUQXKsjWKW4D1uNQ0EgverLYnG';

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
