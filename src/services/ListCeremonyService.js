import axios from 'axios';

const API_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const ACCESS_TOKEN ="00DgK0000029e5F!AQEAQHnhoaObIxBmF3HzYzxSUsTnpvpmwh6eFURgd7W2N0HXjzu0eo4kq1i1C50I8zCBj7z8.QIkv7CFyX1PJEJy0jzW3p9I";
export const fetchAllCeremonies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/services/data/v56.0/query?q=SELECT+Id,Name,Date_and_Time__c+FROM+Wedding__c`,
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