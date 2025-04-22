import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGuestsByWeddingId, addGuest, deleteGuest } from '../services/GuestService.js';
import '../styles/GuestManagement.css';

const GuestManagement = () => {
  const { id: weddingId } = useParams();
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ Name: '', Email__c: '' });

  const loadGuests = async () => {
    const data = await fetchGuestsByWeddingId(weddingId);
    setGuests(data);
  };

  useEffect(() => {
    loadGuests();
  }, [weddingId]);

  const handleChange = (e) => {
    setNewGuest({ ...newGuest, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await addGuest(weddingId, newGuest);
    setNewGuest({ Name: '', Email__c: '' });
    loadGuests();
  };

  const handleDelete = async (guestId) => {
    await deleteGuest(guestId);
    loadGuests();
  };

  return (
    <div className="guest-container">
      <h2>Invités de la cérémonie</h2>

      <table className="guest-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {guests.map(guest => (
            <tr key={guest.Id}>
              <td>{guest.Name}</td>
              <td>{guest.Email__c}</td>
              <td>
                <button className="btn-delete" onClick={() => handleDelete(guest.Id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-add-guest">
        <h3>Ajouter un invité</h3>
        <input
          type="text"
          name="Name"
          placeholder="Nom"
          value={newGuest.Name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="Email__c"
          placeholder="Email"
          value={newGuest.Email__c}
          onChange={handleChange}
        />
        <button className="btn-add" onClick={handleAdd}>Ajouter</button>
      </div>
    </div>
  );
};

export default GuestManagement;
