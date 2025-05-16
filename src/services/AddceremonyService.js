import axios from 'axios';

// Configuration de base
const API_CONFIG = {
  instanceUrl: 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com',
  apiVersion: 'v55.0',
  accessToken: "00DgK0000029e5F!AQEAQMeSddtqm3RxaF_85l90E_ve0_1CnTdKtlbLS3inkEXJh3j_wUB7Lk9nLUi79qroLy1DRh4DIz56su6G4l_dl2KPvPe_",
};

// Création d'une instance Axios avec configuration par défaut
const salesforceAPI = axios.create({
  baseURL: `${API_CONFIG.instanceUrl}/services/data/${API_CONFIG.apiVersion}`,
  headers: {
    'Authorization': `Bearer ${API_CONFIG.accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs
salesforceAPI.interceptors.response.use(
  response => response,
  error => {
    // Logging détaillé des erreurs
    if (error.response) {
      console.error('Erreur de la réponse Salesforce:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Gérer les erreurs spécifiques
      if (error.response.status === 401) {
        // Session expirée - déconnecter l'utilisateur ou rafraîchir le token
        console.error('Session expirée: redirection vers la page de connexion');
        // window.location.href = '/login'; // Décommenter pour activer la redirection
      }
    } else if (error.request) {
      console.error('Pas de réponse reçue:', error.request);
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Sauvegarde les données d'un mariage dans Salesforce
 * @param {Object} data - Les données du mariage à sauvegarder
 * @returns {Promise} - Promesse résolue avec le résultat de l'API ou rejetée avec une erreur
 */
export const saveWeddingData = async (data) => {
  try {
    // Validation de base côté client
    if (!data.Couple_name__c) {
      throw new Error('Le couple est requis');
    }
    
    if (!data.Location__c) {
      throw new Error('Le lieu est requis');
    }
    
    if (!data.Date_and_Time__c) {
      throw new Error('La date et l\'heure sont requises');
    }
    
    if (!data.Statut__c) {
      throw new Error('Le statut est requis');
    }
    
    // Log des données envoyées à Salesforce
    console.log("🔄 Envoi des données à Salesforce:", data);

    // Envoi des données
    const response = await salesforceAPI.post('/sobjects/Wedding__c', data);
    
    // Log de la réponse
    console.log("✅ Réponse de Salesforce:", response.data);
    
    return response.data;
  } catch (error) {
    // Gestion d'erreur
    console.error("🔥 Erreur dans saveWeddingData:", 
      error.response ? 
        `Status: ${error.response.status}, Message: ${JSON.stringify(error.response.data)}` : 
        error.message);
    
    throw error;
  }
};

/**
 * Recherche des couples dans Salesforce
 * @param {string} searchTerm - Terme de recherche
 * @returns {Promise<Array>} - Promesse résolue avec un tableau de résultats
 */
export const searchCouples = async (searchTerm) => {
  try {
    if (!searchTerm || searchTerm.length < 1) {
      return [];
    }
    
    // Requête SOQL simplifiée pour ne récupérer que l'Id et le Name
    const query = `SELECT Id, Name FROM Couple__c WHERE Name LIKE '%${searchTerm}%' LIMIT 10`;
    
    console.log("Executing SOQL query:", query);
    
    const response = await salesforceAPI.get(`/query?q=${encodeURIComponent(query)}`);
    
    console.log("Réponse complète de Salesforce:", response);
    
    // S'assurer que la réponse a la structure attendue
    if (response && response.data) {
      console.log("Résultats de la recherche de couples:", response.data);
      
      // Vérifier si les records existent dans la réponse
      if (response.data.records && Array.isArray(response.data.records)) {
        return response.data.records;
      } else {
        console.warn("Aucun enregistrement trouvé ou format inattendu:", response.data);
        return [];
      }
    }
    
    console.warn("Réponse sans données:", response);
    return [];
  } catch (error) {
    console.error("🔥 Erreur lors de la recherche de couples:", error);
    // Renvoyer un tableau vide en cas d'erreur pour éviter les erreurs undefined
    return [];
  }
};

/**
 * Récupère les détails d'un couple par son ID
 * @param {string} coupleId - ID du couple
 * @returns {Promise<Object>} - Promesse résolue avec les détails du couple
 */
export const getCoupleDetails = async (coupleId) => {
  try {
    if (!coupleId) {
      throw new Error('ID du couple requis');
    }
    
    const response = await salesforceAPI.get(`/sobjects/Couple__c/${coupleId}`);
    return response.data;
  } catch (error) {
    console.error(`🔥 Erreur lors de la récupération des détails du couple ${coupleId}:`, error);
    throw error;
  }
};