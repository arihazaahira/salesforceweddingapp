import React, { useEffect, useState } from 'react';
import { handleCoupleResponse } from '../services/ProviderService';

const typesWithForm = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];

const CoupleForm = ({ providers }) => {
  const [selectedProviders, setSelectedProviders] = useState({});

  const groupedProviders = typesWithForm.reduce((acc, type) => {
    acc[type] = (providers || []).filter(p => p.Type__c === type && p.Status__c === 'Accepted');
    return acc;
  }, {});

  const handleSelect = async (type, selectedId) => {
    setSelectedProviders(prev => ({ ...prev, [type]: selectedId }));

    for (const provider of groupedProviders[type]) {
      const newValue = provider.Id === selectedId ? 'Accepted' : 'Refused';
      if (provider.Couple_Response__c !== newValue) {
        await handleCoupleResponse(provider.Id, newValue);
      }
    }
  };

  if (!providers || !Array.isArray(providers)) {
    return <div>Chargement des prestataires...</div>;
  }

  return (
    <div>
      <h2>Choix du couple</h2>
      {typesWithForm.map(type => (
        <div key={type}>
          <h3>{type}</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Prix</th>
                <th>Disponibilité</th>
                <th>Qualité</th>
                <th>Références</th>
                <th>Choix du couple</th>
              </tr>
            </thead>
            <tbody>
              {groupedProviders[type].map(provider => (
                <tr key={provider.Id}>
                  <td>{provider.Name}</td>
                  <td>{provider.Phone__c}</td>
                  <td>{provider.Price__c}</td>
                  <td>{provider.Availability__c}</td>
                  <td>{provider.ServiceQuality__c}</td>
                  <td>{provider.References__c}</td>
                  <td>
                    <input
                      type="radio"
                      name={`provider-${type}`}
                      checked={selectedProviders[type] === provider.Id}
                      onChange={() => handleSelect(type, provider.Id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default CoupleForm;
