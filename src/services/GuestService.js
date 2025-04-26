import axios from 'axios';

<<<<<<< HEAD
const ACCESS_TOKEN = '00DgK0000029e5F!AQEAQHnNyxrx0JJ0PCPmaKeWIB.9iZVEUf2A.rqcpbvxFSWmK3ygZpvbMQpwXlc5OYLV0Mvrq3g01ka_pDf.Ug70okl_CCc9';;
=======
const ACCESS_TOKEN = "00DgK0000029e5F!AQEAQDSMvBsLMUtiJTRuPl8iJXZBSeGY8.QCiQB_ySbniPJfyx3KUXwGrB3vWERXbf.NkAcVfdm3wrDKoJoSddd5M1RNk7x3";
>>>>>>> 9e58816a4f18388e64b6dfe288544f5da423529a
const INSTANCE_URL = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';
const API_VERSION = 'v59.0'; // ou la version que tu utilises
const BASE_URL = `${INSTANCE_URL}/services/data/${API_VERSION}/sobjects/Guest__c`;

const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
};

export const getGuestsByWeddingId = async (weddingId) => {
  const query = `SELECT Id, Name, Email__c, Wedding__c FROM Guest__c WHERE Wedding__c='${weddingId}'`;
  const url = `${INSTANCE_URL}/services/data/${API_VERSION}/query?q=${encodeURIComponent(query)}`;
  
  const response = await axios.get(url, { headers });
  return response.data.records;
};

export const addGuest = async (guest) => {
  const response = await axios.post(BASE_URL, guest, { headers });
  return response.data;
};

export const deleteGuest = async (guestId) => {
  const url = `${BASE_URL}/${guestId}`;
  const response = await axios.delete(url, { headers });
  return response.data;
};
