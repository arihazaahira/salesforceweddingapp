import axios from 'axios';

const ACCESS_TOKEN=process.env.REACT_APP_SF_ACCESS_TOKEN;
const INSTANCE_URL=process.env.REACT_APP_SF_INSTANCE_URL;
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
