import React, { useEffect, useState } from 'react';
import { addProvider, getProvidersByWeddingId, deleteProvider } from '../services/ProviderService';
import '../styles/ProviderList.css';

const ProviderList = ({ weddingId }) => {
  const [providers, setProviders] = useState([]);
  const [newProvider, setNewProvider] = useState({
    Name: '',
    Type__c: '',
    Phone__c: '',
    Status__c: ''
  });

  const typeOptions = ['DJ', 'Food Provider', 'Logistics Provider', 'Dresser','Makeup Artist'];
  const statusOptions = ['Not Confirmed', 'Processing', 'Finished'];

  useEffect(() => {
    fetchProviders();
  }, [weddingId]);

  const fetchProviders = async () => {
    const data = await getProvidersByWeddingId(weddingId);
    setProviders(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    if (!newProvider.Name || !newProvider.Type__c || !newProvider.Status__c) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const providerToAdd = {
      ...newProvider,
      Wedding__c: weddingId
    };

    await addProvider(providerToAdd);
    setNewProvider({ Name: '', Type__c: '', Phone__c: '', Status__c: '' });
    fetchProviders();
  };

  const handleDelete = async (id) => {
    await deleteProvider(id);
    fetchProviders();
  };

  return (
    <div className="provider-section">
      <h3>Liste des prestataires</h3>

      <div className="form-group">
        <input
          type="text"
          name="Name"
          placeholder="Nom du prestataire"
          value={newProvider.Name}
          onChange={handleChange}
        />

        <select name="Type__c" value={newProvider.Type__c} onChange={handleChange}>
          <option value="">Type de service</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <input
          type="tel"
          name="Phone__c"
          placeholder="Téléphone"
          value={newProvider.Phone__c}
          onChange={handleChange}
        />

        <select name="Status__c" value={newProvider.Status__c} onChange={handleChange}>
          <option value="">Statut</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button className="add-btn" onClick={handleAdd}>Ajouter</button>
      </div>

      {providers.length === 0 ? (
        <p>Aucun prestataire pour le moment.</p>
      ) : (
        <table className="provider-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.Id}>
                <td>{provider.Name}</td>
                <td>{provider.Type__c}</td>
                <td>{provider.Phone__c}</td>
                <td>{provider.Status__c}</td>
                <td>
                  <button onClick={() => handleDelete(provider.Id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProviderList;
