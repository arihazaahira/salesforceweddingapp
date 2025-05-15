import axios from 'axios';

const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQBZZHGoq7b4bXsmGQ.0cGhHWqZUTr6MFTsewdTsCaqCecuqpj1tCG1NVG.IALEqjZfA37CSxAEqg1HtOfVFQusAjIrA9";
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
  
