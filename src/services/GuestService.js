import axios from 'axios';

const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQHnNyxrx0JJ0PCPmaKeWIB.9iZVEUf2A.rqcpbvxFSWmK3ygZpvbMQpwXlc5OYLV0Mvrq3g01ka_pDf.Ug70okl_CCc9';;
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

// ✅ Récupérer les invités liés à une cérémonie
export const fetchGuestsByWeddingId = async (weddingId) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v56.0/query?q=SELECT+Id,Name,Email__c+FROM+Guest__c+WHERE+Wedding__c='${weddingId}'`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data.records;
  } catch (error) {
    console.error('Erreur lors de la récupération des invités :', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Ajouter un invité
export const addGuest = async (weddingId, guestData) => {
  try {
    const dataToSend = {
      ...guestData,
      Wedding__c: weddingId
    };

    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v56.0/sobjects/Guest__c`,
      dataToSend,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout d’un invité :', error.response?.data || error.message);
    throw error;
  }
};

// ✅ Supprimer un invité
export const deleteGuest = async (guestId) => {
  try {
    const response = await axios.delete(
      `${INSTANCE_URL}/services/data/v56.0/sobjects/Guest__c/${guestId}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression d’un invité :', error.response?.data || error.message);
    throw error;
  }
};
