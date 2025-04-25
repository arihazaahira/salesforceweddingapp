import axios from 'axios';

const API_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const ACCESS_TOKEN ='00DgK0000029e5F!AQEAQHnNyxrx0JJ0PCPmaKeWIB.9iZVEUf2A.rqcpbvxFSWmK3ygZpvbMQpwXlc5OYLV0Mvrq3g01ka_pDf.Ug70okl_CCc9';

export const fetchAllCeremonies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/services/data/v56.0/query?q=SELECT+Id,Name,Statut__c,Date_and_Time__c+FROM+Wedding__c`,
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