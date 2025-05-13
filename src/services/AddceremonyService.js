import axios from 'axios';

export const saveWeddingData = async (data) => {
  const accessToken = "00DgK0000029e5F!AQEAQHnhoaObIxBmF3HzYzxSUsTnpvpmwh6eFURgd7W2N0HXjzu0eo4kq1i1C50I8zCBj7z8.QIkv7CFyX1PJEJy0jzW3p9I"; // Remplace par ton vrai access token
  const instanceUrl = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com'; // Remplace par l'URL de ton instance Salesforce

  try {
    // Log des données envoyées à Salesforce pour vérifier leur validité
    console.log("🔄 Envoi des données à Salesforce:", data);

    // Envoi des données via Axios
    const response = await axios.post(`${instanceUrl}/services/data/v55.0/sobjects/Wedding__c`, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Log de la réponse de Salesforce pour vérifier que tout s'est bien passé
    console.log("✅ Réponse de Salesforce:", response.data);

    // Si la réponse contient un résultat, retourne-le
    return response.data;
  } catch (error) {
    // Log l'erreur si quelque chose échoue
    console.error("🔥 Erreur dans saveWeddingData:", error.response ? error.response.data : error.message);
    throw error;
  }
};
