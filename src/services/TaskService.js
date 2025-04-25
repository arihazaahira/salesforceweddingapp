import axios from 'axios';

const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3";
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};
export const getTasksByWeddingId = async (weddingId) => {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v60.0/query/?q=SELECT+Id,Name,Status__c,Due_Date__c,Assigned_To_c+FROM+Task__c+WHERE+Wedding__c='${weddingId}'`,
      { headers }
    );
    return response.data.records;
  };
  
  export const addTask = async (taskData) => {
    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Task__c`,
      taskData,
      { headers }
    );
    return response.data;
  };
  
  export const deleteTask = async (taskId) => {
    const response = await axios.delete(
      `${INSTANCE_URL}/services/data/v60.0/sobjects/Task__c/${taskId}`,
      { headers }
    );
    return response.status === 204;
  };
  
