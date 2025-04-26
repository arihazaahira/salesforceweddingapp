import axios from 'axios';

const API_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const ACCESS_TOKEN ='00DgK0000029e5F!AQEAQPYVB5DiebQWqs_Dk1LU2fCVdnWPVYLfZy6M0QDexdZhP98g.g.3z8OGdKX30o0wHShQBQEr8Ysl4Z4Mq7lsjX854gRC';



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