import React, { useEffect, useState } from 'react';
import {
  addProvider,
  getProvidersByWeddingId,
  deleteProvider,
  handleCoupleResponse
} from '../services/ProviderService';
import CoupleForm from './CoupleForm';
import '../styles/ProviderList.css';

const ProviderList = ({ weddingId }) => {
  const [providers, setProviders] = useState([]);
  const [newProvider, setNewProvider] = useState({
    Name: '',
    Type__c: '',
    Phone__c: '',
    Status__c: '',
    Couple_Response__c: '',
    Price__c: '',
    Availability__c: '',
    ServiceQuality__c: '',
    References__c: ''
  });

  const typeOptions = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];
  const statusOptions = ['Not Confirmed', 'Processing', 'Finished'];
  const coupleResponseOptions = ['Accepted', 'Refused', 'Not Precised'];
  const typesWithForm = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];

  useEffect(() => {
    fetchProviders();
  }, [weddingId]);

  const fetchProviders = async () => {
    try {
      const data = await getProvidersByWeddingId(weddingId);
      console.log("Providers récupérés :", data);
      setProviders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestataires :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const requiredFields = ['Name', 'Type__c', 'Status__c', 'Couple_Response__c'];
    const missingFields = requiredFields.filter((field) => !newProvider[field]);

    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const providerToAdd = {
        ...newProvider,
        Wedding__c: weddingId
      };

      await addProvider(providerToAdd);
      setNewProvider({
        Name: '',
        Type__c: '',
        Phone__c: '',
        Status__c: '',
        Couple_Response__c: '',
        Price__c: '',
        Availability__c: '',
        ServiceQuality__c: '',
        References__c: ''
      });
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de l'ajout du prestataire :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProvider(id);
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de la suppression du prestataire :", error);
    }
  };

  const onCoupleApproval = async (selectedProviderId, type) => {
    const providersOfSameType = providers.filter(p => p.Type__c === type);
    try {
      for (const provider of providersOfSameType) {
        const response = provider.Id === selectedProviderId ? 'Accepted' : 'Refused';
        await handleCoupleResponse(provider.Id, response);
      }
      fetchProviders();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réponse du couple :", error);
    }
  };

  const providersByType = (type) => providers.filter(provider => provider.Type__c === type);

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

        <input
          type="number"
          name="Price__c"
          placeholder="Prix estimé"
          value={newProvider.Price__c}
          onChange={handleChange}
        />

        <input
          type="date"
          name="Availability__c"
          value={newProvider.Availability__c}
          onChange={handleChange}
        />

        <div className="stars-rating">
          <label>Qualité du service:</label>
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star}>
              <input
                type="radio"
                name="ServiceQuality__c"
                value={star}
                checked={newProvider.ServiceQuality__c === star.toString()}
                onChange={handleChange}
              />
              {star}
            </label>
          ))}
        </div>

        <input
          type="url"
          name="References__c"
          placeholder="Références (URL)"
          value={newProvider.References__c}
          onChange={handleChange}
        />

        <select name="Couple_Response__c" value={newProvider.Couple_Response__c} onChange={handleChange}>
          <option value="">Réponse du couple</option>
          {coupleResponseOptions.map((response) => (
            <option key={response} value={response}>{response}</option>
          ))}
        </select>

        <button className="add-btn" onClick={handleAdd}>Ajouter</button>
      </div>

      {providers.length === 0 ? (
        <p>Aucun prestataire pour le moment.</p>
      ) : (
        <div>
          {typeOptions.map((type) => {
            const filteredProviders = providersByType(type);
            return (
              filteredProviders.length > 0 && (
                <div key={type}>
                  <h4>{type}</h4>
                  <table className="provider-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Type</th>
                        <th>Téléphone</th>
                        <th>Statut</th>
                        <th>Prix</th>
                        <th>Disponibilité</th>
                        <th>Note</th>
                        <th>Références</th>
                        <th>Réponse du couple</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProviders.map((provider) => (
                        <React.Fragment key={provider.Id}>
                          <tr>
                            <td>{provider.Name}</td>
                            <td>{provider.Type__c}</td>
                            <td>{provider.Phone__c}</td>
                            <td>{provider.Status__c}</td>
                            <td>{provider.Price__c ? `${provider.Price__c} MAD` : '-'}</td>
                            <td>{provider.Availability__c || '-'}</td>
                            <td>{provider.ServiceQuality__c ? `${provider.ServiceQuality__c} / 5` : '-'}</td>
                            <td>
                              {provider.References__c ? (
                                <a href={provider.References__c} target="_blank" rel="noopener noreferrer">Lien</a>
                              ) : '-'}
                            </td>
                            <td>
  <span>
    {provider.Couple_Response__c || 'Not Precised'}
  </span>
</td>
                            <td>
                              <button onClick={() => handleDelete(provider.Id)}>Supprimer</button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProviderList;
