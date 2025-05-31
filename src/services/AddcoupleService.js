export const saveCoupleData = async (data) => {
  const accessToken = "00DgK0000029e5F!AQEAQD8Glm7qvNhnz2l7LT1k4fBQB6o4od.dJyYNLrrT.wZF78YKPX4gR9xRqSDc9PEZu8BUUW5uG9h9Qp3zrdZd4hqlBIiA" 

  const instanceUrl = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

  try {
    console.log("🔄 Envoi des données à Salesforce:", data);

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

