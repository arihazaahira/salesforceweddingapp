import React, { useState, useEffect } from 'react';
import { fetchAllCeremonies } from '../services/ListCeremonyService';
import '../styles/Listceremony.css';

const ListCeremony = () => {
  const [ceremonies, setCeremonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllCeremonies();
        setCeremonies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="list-ceremony-container">
      <h1 className="title">Liste des Cérémonies</h1>
      <table className="ceremony-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Date et Heure</th>
            <th>Lieu</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {ceremonies.map(ceremony => (
            <tr key={ceremony.Id}>
              <td>{ceremony.Id}</td>
              <td>{ceremony.Name}</td>
              <td>{ceremony.Date_and_Time__c}</td>
              <td>{ceremony.Location__c || '-'}</td>
              <td>{ceremony.Description__c || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCeremony;
