export const saveCoupleData = async (data) => {
<<<<<<< HEAD
  const accessToken = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3"; 
=======
  const accessToken = '00DgK0000029e5F!AQEAQC4pveIoGVB.Ot2IGwkNkFk1_3WeO4QF6BLUN9J8SYoVRFuIXiZmrScH6wmjkqRpNnBA82NV4N4sNKvQHQsK6oSghkXk'; 
>>>>>>> df6d02ecd8e75e984fce0b0341788cdf777aad97
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
