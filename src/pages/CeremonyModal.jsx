import React from 'react';

const CeremonyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h3>Modifier la cérémonie</h3>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default CeremonyModal;
