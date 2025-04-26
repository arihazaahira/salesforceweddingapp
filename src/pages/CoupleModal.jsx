import React from 'react';

const CoupleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h3>Informations du couple</h3>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default CoupleModal;
