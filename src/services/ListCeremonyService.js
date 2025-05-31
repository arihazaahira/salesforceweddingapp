import axios from 'axios';

const API_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const ACCESS_TOKEN ="00DgK0000029e5F!AQEAQD8Glm7qvNhnz2l7LT1k4fBQB6o4od.dJyYNLrrT.wZF78YKPX4gR9xRqSDc9PEZu8BUUW5uG9h9Qp3zrdZd4hqlBIiA"



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