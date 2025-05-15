import axios from 'axios';

const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQBZZHGoq7b4bXsmGQ.0cGhHWqZUTr6MFTsewdTsCaqCecuqpj1tCG1NVG.IALEqjZfA37CSxAEqg1HtOfVFQusAjIrA9";
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const PLANNING_OBJECT = 'planning__c';

export const getPlanningByWeddingId = async (weddingId) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v57.0/query/?q=SELECT+Id,Name,Date__c,Description__c,Status__c+FROM+${PLANNING_OBJECT}+WHERE+Wedding__c='${weddingId}'`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    return response.data.records;
  } catch (error) {
    console.error('Erreur lors de la récupération du planning :', error);
    throw error;
  }
};

export const addPlanningStep = async (stepData) => {
  try {
    const response = await axios.post(
      `${INSTANCE_URL}/services/data/v57.0/sobjects/${PLANNING_OBJECT}/`,
      stepData,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout d’une étape de planning :', error);
    throw error;
  }
};

export const deletePlanningStep = async (id) => {
  try {
    await axios.delete(`${INSTANCE_URL}/services/data/v57.0/sobjects/${PLANNING_OBJECT}/${id}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’étape de planning :', error);
    throw error;
  }
};
