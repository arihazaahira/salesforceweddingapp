export const saveCoupleData = async (data) => {
  const accessToken = process.env.REACT_APP_SF_ACCESS_TOKEN;
  const instanceUrl = process.env.REACT_APP_SF_INSTANCE_URL;



  try {
    const response = await fetch(`${instanceUrl}/services/data/v55.0/sobjects/Couple__c`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur Salesforce:', result);
      throw new Error(result[0]?.message || 'Erreur lors de l\'envoi à Salesforce');
    }

    console.log('✅ Données enregistrées avec succès :', result);
    return result;
  } catch (error) {
    console.error('🔥 Erreur dans saveCoupleData:', error);
    throw error;
  }
};
