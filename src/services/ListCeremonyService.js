import axios from 'axios';

const ACCESS_TOKEN = process.env.REACT_APP_SF_ACCESS_TOKEN;
const API_URL = process.env.REACT_APP_SF_INSTANCE_URL;

export const fetchAllCeremonies = async () => {
  try {
    const query = `SELECT+Id,Couple_Name__c,Statut__c,Date_and_Time__c+FROM+Wedding__c+WHERE+Statut__c!='Annule'+ORDER+BY+Date_and_Time__c+DESC`;

    const response = await axios.get(
      `${API_URL}/services/data/v56.0/query?q=${query}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.records;
  } catch (error) {
    console.error('Erreur lors de la récupération des cérémonies:', error);
    throw error;
  }
};

export const deleteCeremony = async (ceremonyId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/services/data/v56.0/sobjects/Wedding__c/${ceremonyId}`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.status === 204;
  } catch (error) {
    console.error('Erreur lors de la suppression de la cérémonie:', error);
    throw error;
  }
};