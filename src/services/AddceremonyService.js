import axios from 'axios';

export const saveWeddingData = async (data) => {
<<<<<<< HEAD
  const accessToken = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3"; // Remplace par ton vrai access token
=======
  const accessToken = '00DgK0000029e5F!AQEAQC4pveIoGVB.Ot2IGwkNkFk1_3WeO4QF6BLUN9J8SYoVRFuIXiZmrScH6wmjkqRpNnBA82NV4N4sNKvQHQsK6oSghkXk'; // Remplace par ton vrai access token
>>>>>>> df6d02ecd8e75e984fce0b0341788cdf777aad97
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
