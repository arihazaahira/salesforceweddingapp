import React, { useEffect, useState } from 'react';
import { getGuestsByWeddingId, addGuest, deleteGuest } from '../services/GuestService';
import '../styles/GuestTable.css'; // un peu de style

const GuestTable = ({ weddingId }) => {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, [weddingId]);

  const fetchGuests = async () => {
    try {
      const data = await getGuestsByWeddingId(weddingId);
      setGuests(data);
    } catch (error) {
      console.error("Erreur chargement invités:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!name || !email) return alert("Nom et email requis");

    const newGuest = {
      Name: name,
      Email__c: email,
      Wedding__c: weddingId
    };

    try {
      await addGuest(newGuest);
      setName('');
      setEmail('');
      fetchGuests();
    } catch (error) {
      console.error("Erreur ajout invité:", error);
      alert("Erreur lors de l'ajout");
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm("Supprimer cet invité ?")) return;

    try {
      await deleteGuest(guestId);
      fetchGuests();
    } catch (error) {
      console.error("Erreur suppression invité:", error);
    }
  };

  return (
    <div className="guest-table">
      <h3>Liste des invités</h3>

      <div className="guest-form">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleAddGuest}>Ajouter</button>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : guests.length === 0 ? (
        <p>Aucun invité pour le moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Action</th>
              <th>Invitation envoyée</th>
<th>Rappel envoyé</th>
<th>Remerciement envoyé</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.Id}>
                <td>{guest.Name}</td>
                <td>{guest.Email__c}</td>
                <td>
                  <button onClick={() => handleDeleteGuest(guest.Id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GuestTable;
