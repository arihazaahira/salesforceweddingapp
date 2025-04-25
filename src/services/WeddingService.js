import axios from 'axios';

<<<<<<< HEAD
const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3";
=======
const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQC4pveIoGVB.Ot2IGwkNkFk1_3WeO4QF6BLUN9J8SYoVRFuIXiZmrScH6wmjkqRpNnBA82NV4N4sNKvQHQsK6oSghkXk';
>>>>>>> df6d02ecd8e75e984fce0b0341788cdf777aad97
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

export const getWeddingById = async (id) => {
  try {
    const response = await axios.get(
      `${INSTANCE_URL}/services/data/v55.0/sobjects/Wedding__c/${id}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur dans getWeddingById:', error.response?.data || error.message);
    throw error;
  }
};
