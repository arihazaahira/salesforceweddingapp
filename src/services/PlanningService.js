import axios from 'axios';

const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQMeSddtqm3RxaF_85l90E_ve0_1CnTdKtlbLS3inkEXJh3j_wUB7Lk9nLUi79qroLy1DRh4DIz56su6G4l_dl2KPvPe_";
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
