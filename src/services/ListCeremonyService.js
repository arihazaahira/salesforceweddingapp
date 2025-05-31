import axios from 'axios';

const ACCESS_TOKEN=process.env.REACT_APP_SF_ACCESS_TOKEN;
const API_URL=process.env.REACT_APP_SF_INSTANCE_URL;


export const fetchAllCeremonies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/services/data/v56.0/query?q=SELECT+Id,Couple_Name__c,Statut__c,Date_and_Time__c+FROM+Wedding__c`,
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