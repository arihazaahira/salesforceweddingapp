import React, { useState, useEffect } from 'react';
import {
  addProvider,
  getProvidersByWeddingId,
  deleteProvider,
  handleCoupleResponse,
  lockProvidersInSalesforce,
  getWeddingById
} from '../services/ProviderService';
import { Check, Clock, Calendar, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/ProviderList.css';

const WeddingPlannerDashboard = ({ weddingId }) => {
  // États pour gérer les prestataires et l'étape active
  const [providers, setProviders] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [providersLocked, setProvidersLocked] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [lockingError, setLockingError] = useState(null); 
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

  // États pour la gestion des rendez-vous
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    duration: '60',
    location: '',
    notes: ''
  });

  const typeOptions = ['DJ', 'Dresser', 'Logistics provider', 'Makeup Artist', 'Food Provider', 'Flower Provider'];
  const statusOptions = ['Not Confirmed', 'Processing', 'Finished'];
  const coupleResponseOptions = ['Accepted', 'Refused', 'Not Precised'];

  useEffect(() => {
    fetchProviders();
    fetchWeddingLockStatus();
  }, [weddingId]);

  const fetchProviders = async () => {
    try {
      const data = await getProvidersByWeddingId(weddingId);
      setProviders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prestataires :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({ ...prev, [name]: value }));
  };
  
  const fetchWeddingLockStatus = async () => {
    try {
      const wedding = await getWeddingById(weddingId);
      setProvidersLocked(wedding.Providers_Locked__c);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'état de verrouillage :", error);
    }
  };

  const handleAdd = async () => {
    if (providersLocked) {
      alert("La liste des prestataires est verrouillée. Ajout impossible.");
      return;
    }
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

  const handleLockProviders = async () => {
    if (!weddingId) {
      alert('Aucun ID de mariage spécifié');
      return;
    }
  
    if (providers.length === 0) {
      alert('Vous devez ajouter au moins un prestataire avant de finaliser la liste.');
      return;
    }
  
    // Valider que tous les prestataires ont les champs requis
    const invalidProviders = providers.filter(p => 
      !p.Name || !p.Type__c || !p.Status__c || !p.Couple_Response__c
    );
  
    if (invalidProviders.length > 0) {
      alert(
        `${invalidProviders.length} prestataire(s) invalide(s).\n\n` +
        'Tous les prestataires doivent avoir :\n' +
        '- Un nom\n' +
        '- Un type de service\n' +
        '- Un statut\n' +
        '- Une réponse du couple'
      );
      return;
    }
  
    const confirmLock = window.confirm(
      "⚠️ ATTENTION ⚠️\n\n" +
      "Êtes-vous sûr de vouloir finaliser la liste des prestataires ?\n\n" +
      "Une fois finalisée :\n" +
      "• Vous ne pourrez plus ajouter ou supprimer de prestataires\n" +
      "• Un email sera automatiquement envoyé au couple\n" +
      "• Le couple aura 48 heures pour faire ses choix\n\n" +
      "Cette action est irréversible. Voulez-vous continuer ?"
    );
  
    if (!confirmLock) return;
  
    setIsLocking(true);
    setLockingError(null);
  
    try {
      const result = await lockProvidersInSalesforce(weddingId);
      
      if (result && result[0]?.success) {
        setProvidersLocked(true);
        alert(
          '✅ Liste des prestataires finalisée avec succès !\n\n' +
          '📧 Un email a été envoyé au couple avec la liste des prestataires.\n' +
          '⏱️ Le couple a maintenant 48 heures pour faire ses choix.\n' +
          '🔒 Vous ne pouvez plus modifier la liste des prestataires.'
        );
        setActiveStep(1);
      } else {
        throw new Error(result?.[0]?.message || 'Erreur inconnue lors du verrouillage');
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      setLockingError(error.message);
      alert(
        '❌ Erreur lors de la finalisation\n\n' +
        `${error.message}\n\n` +
        'Veuillez vérifier la console pour plus de détails.'
      );
    } finally {
      setIsLocking(false);
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
  const handleEditAppointment = (appointmentId) => {
    const appointmentToEdit = appointments.find(apt => apt.id === appointmentId);
    if (!appointmentToEdit) return;
  
    setSelectedProvider({
      Id: appointmentToEdit.providerId,
      Name: appointmentToEdit.providerName,
      Type__c: appointmentToEdit.providerType
    });
  
    setAppointmentForm({
      date: appointmentToEdit.date,
      time: appointmentToEdit.time,
      duration: appointmentToEdit.duration,
      location: appointmentToEdit.location,
      notes: appointmentToEdit.notes
    });
  
    setSelectedDate(new Date(appointmentToEdit.date));
    setShowModal(true);
  };
  
  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?")) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    }
  };
  
  const handleUpdateAppointment = () => {
    if (!selectedProvider) return;
  
    setAppointments(prev => prev.map(apt => 
      apt.providerId === selectedProvider.Id
        ? {
            ...apt,
            date: appointmentForm.date,
            time: appointmentForm.time,
            duration: appointmentForm.duration,
            location: appointmentForm.location,
            notes: appointmentForm.notes
          }
        : apt
    ));
  
    closeAppointmentModal();
    alert('Rendez-vous modifié avec succès !');
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

  // Fonctions pour la gestion des rendez-vous
  const openAppointmentModal = (provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
    setSelectedDate(null);
    setAppointmentForm({
      date: '',
      time: '',
      duration: '60',
      location: '',
      notes: ''
    });
  };

  const closeAppointmentModal = () => {
    setShowModal(false);
    setSelectedProvider(null);
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setAppointmentForm(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
  };

  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const confirmAppointment = () => {
    const existingAppointment = appointments.find(
      apt => apt.providerId === selectedProvider.Id
    );
  
    if (existingAppointment) {
      alert(`Un rendez-vous est déjà planifié avec ${selectedProvider.Name}.
  Date: ${existingAppointment.date} à ${existingAppointment.time}`);
      return;
    }
    if (!appointmentForm.date || !appointmentForm.time) {
      alert('Veuillez sélectionner une date et une heure.');
      return;
    }
    const isEditing = appointments.some(apt => apt.providerId === selectedProvider.Id);
    if (isEditing) {
      handleUpdateAppointment();
    }

    else {
      const newAppointment = {
        id: Date.now().toString(),
        providerId: selectedProvider.Id,
        providerName: selectedProvider.Name,
        providerType: selectedProvider.Type__c,
        date: appointmentForm.date,
        time: appointmentForm.time,
        duration: appointmentForm.duration,
        location: appointmentForm.location,
        notes: appointmentForm.notes,
        status: 'Planifié'
      };
  
      setAppointments(prev => [...prev, newAppointment]);
      closeAppointmentModal();
      alert('Rendez-vous planifié avec succès !');
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    // Compléter jusqu'à 42 cases (6 semaines)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const hasAppointmentOnDate = (date,providerId) => {
    const dateStr = date.toISOString().split('T')[0];
  return appointments.some(apt => 
    apt.providerId === providerId && 
    apt.date === dateStr
  );
};

  const getAppointmentsForProvider = (providerId) => {
    return appointments.filter(apt => apt.providerId === providerId);

  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planifié': return 'bg-blue-100 text-blue-800';
      case 'Confirmé': return 'bg-green-100 text-green-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const providersByType = (type) => providers.filter(provider => provider.Type__c === type);

  const steps = [
    {
      id: 0,
      name: "Gestion des prestataires",
      icon: <Check size={24} />,
      description: "Ajoutez et gérez les prestataires pour le mariage"
    },
    {
      id: 1,
      name: "Réponses des couples",
      icon: <Clock size={24} />,
      description: "Attente des réponses des couples"
    },
    {
      id: 2,
      name: "Planning des RDV",
      icon: <Calendar size={24} />,
      description: "Planifiez les rendez-vous avec prestataires et couples"
    },
    {
      id: 3,
      name: "Last Wedding Touch Up",
      icon: <Sparkles size={24} />,
      description: "Finalisez les derniers détails"
    }
  ];

  return (
    <div className="wedding-planner-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Wedding Planner</h2>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`step-item ${
                activeStep === index 
                  ? 'active-step' 
                  : activeStep > index 
                    ? 'completed-step' 
                    : 'inactive-step'
              }`}
            >
              <div className="step-icon">
                {step.icon}
              </div>
              <div>
                <div className="step-name">{step.name}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activeStep === 0 && (
          <div className="provider-section">
            <h2>Gestion des prestataires</h2>
            
            {!providersLocked ? (
              <div className="add-provider-container">
                <div className="add-provider-header">
                  <h3>Ajouter un prestataire</h3>
                  <button 
                    onClick={handleLockProviders}
                    className="lock-providers-button"
                    disabled={isLocking}
                  >
                    {isLocking ? 'Finalisation en cours...' : 'Finaliser la liste des prestataires'}
                  </button>
                </div>
                <div className="provider-form-grid">
                  <div className="form-group">
                    <label>Nom du prestataire</label>
                    <input
                      type="text"
                      name="Name"
                      placeholder="Nom du prestataire"
                      value={newProvider.Name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Type de service</label>
                    <select 
                      name="Type__c" 
                      value={newProvider.Type__c} 
                      onChange={handleChange}
                    >
                      <option value="">Type de service</option>
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input
                      type="tel"
                      name="Phone__c"
                      placeholder="Téléphone"
                      value={newProvider.Phone__c}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select 
                      name="Status__c" 
                      value={newProvider.Status__c} 
                      onChange={handleChange}
                    >
                      <option value="">Statut</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Prix estimé</label>
                    <input
                      type="number"
                      name="Price__c"
                      placeholder="Prix estimé"
                      value={newProvider.Price__c}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Disponibilité</label>
                    <input
                      type="date"
                      name="Availability__c"
                      value={newProvider.Availability__c}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Qualité du service</label>
                    <div className="rating-container">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="rating-option">
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
                  </div>

                  <div className="form-group">
                    <label>Références (URL)</label>
                    <input
                      type="url"
                      name="References__c"
                      placeholder="Références (URL)"
                      value={newProvider.References__c}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Réponse du couple</label>
                    <select 
                      name="Couple_Response__c" 
                      value={newProvider.Couple_Response__c} 
                      onChange={handleChange}
                    >
                      <option value="">Réponse du couple</option>
                      {coupleResponseOptions.map((response) => (
                        <option key={response} value={response}>{response}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="add-provider-button-container">
                  <button 
                    className="add-provider-button"
                    onClick={handleAdd}
                  >
                    Ajouter le prestataire
                  </button>
                </div>
              </div>
            ) : (
              <div className="locked-notification">
                <div className="locked-notification-content">
                  <span>La liste des prestataires a été finalisée. Vous ne pouvez plus ajouter de prestataires.</span>
                </div>
              </div>
            )}

            <div className="providers-list-container">
              <h3>Liste des prestataires</h3>
              {providers.length === 0 ? (
                <p>Aucun prestataire pour le moment.</p>
              ) : (
                <div>
                  {typeOptions.map((type) => {
                    const filteredProviders = providersByType(type);
                    return (
                      filteredProviders.length > 0 && (
                        <div key={type} className="provider-type-section">
                          <h4>{type}</h4>
                          <div className="providers-table-container">
                            <table className="providers-table">
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
                                  <tr key={provider.Id}>
                                    <td>{provider.Name}</td>
                                    <td>{provider.Type__c}</td>
                                    <td>{provider.Phone__c}</td>
                                    <td>{provider.Status__c}</td>
                                    <td>{provider.Price__c ? `${provider.Price__c} MAD` : '-'}</td>
                                    <td>{provider.Availability__c || '-'}</td>
                                    <td>{provider.ServiceQuality__c ? `${provider.ServiceQuality__c} / 5` : '-'}</td>
                                    <td>
                                      {provider.References__c ? (
                                        <a href={provider.References__c} target="_blank" rel="noopener noreferrer" className="reference-link">Lien</a>
                                      ) : '-'}
                                    </td>
                                    <td>
                                      <span className={`couple-response ${
                                        provider.Couple_Response__c === 'Accepted' ? 'accepted' :
                                        provider.Couple_Response__c === 'Refused' ? 'refused' :
                                        'not-precised'
                                      }`}>
                                        {provider.Couple_Response__c || 'Not Precised'}
                                      </span>
                                    </td>
                                    <td>
                                      <button 
                                        onClick={() => handleDelete(provider.Id)}
                                        className="delete-button"
                                        disabled={providersLocked}
                                      >
                                        Supprimer
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <h2>Réponses des couples</h2>
            <div className="couple-responses-container">
              <p>Cette section affichera l'état des réponses des couples concernant les prestataires proposés.</p>
              
              <div className="responses-grid">
                {providers.length > 0 ? (
                  typeOptions.map((type) => {
                    const typeProviders = providersByType(type);
                    if (typeProviders.length === 0) return null;
                    
                    return (
                      <div key={type} className="response-card">
                        <h3>{type}</h3>
                        <div className="providers-list">
                          {typeProviders.map(provider => (
                            <div key={provider.Id} className="provider-response-item">
                              <span>{provider.Name}</span>
                              <span className={`couple-response ${
                                provider.Couple_Response__c === 'Accepted' ? 'accepted' :
                                provider.Couple_Response__c === 'Refused' ? 'refused' :
                                'not-precised'
                              }`}>
                                {provider.Couple_Response__c || 'Not Precised'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Aucun prestataire n'a été ajouté.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h2>Planning des rendez-vous</h2>
            <div className="appointments-container">
              <p>Cette section permettra de planifier les rendez-vous avec les prestataires et les couples.</p>
              
              <div className="accepted-providers-section">
                <h3>Prestataires acceptés</h3>
                {providers.filter(p => p.Couple_Response__c === 'Accepted').length > 0 ? (
                  <div className="providers-grid">
                    {providers
                      .filter(p => p.Couple_Response__c === 'Accepted')
                      .map(provider => {
                        const providerAppointments = getAppointmentsForProvider(provider.Id);
                        const hasAppointment = providerAppointments.length > 0;
                        return (
                          <div key={provider.Id} className="provider-card">
                            <div className="provider-name">{provider.Name}</div>
                            <div className="provider-type">{provider.Type__c}</div>
                            <div className="provider-phone">Téléphone: {provider.Phone__c || 'Non spécifié'}</div>
                            <div className="provider-availability">Disponibilité: {provider.Availability__c || 'Non spécifiée'}</div>
                            
                            {providerAppointments.length > 0 && (
                              <div className="provider-appointments">
                                <h4>Rendez-vous planifiés:</h4>
                                {providerAppointments.map(apt => (
                                  <div key={apt.id} className="appointment-item">
                                    <div className="appointment-date">{apt.date} à {apt.time}</div>
                                    <div className="appointment-location">{apt.location}</div>
                                    <div className="appointment-status">{apt.status}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="schedule-button-container">
                              <button 
                              className={`schedule-button ${hasAppointment ? 'disabled-button' : ''}`}
                              onClick={() => !hasAppointment && openAppointmentModal(provider)}
                              disabled={hasAppointment}
                            >
                              {hasAppointment ? (
                                <>
                                  <Check size={16} /> RDV Planifié
                                </>
                              ) : (
                                'Planifier un RDV'
                              )}
                            </button>
                            
                            {hasAppointment && (
  <div className="appointment-actions">
    <button 
      className="view-appointment-button"
      onClick={() => handleEditAppointment(providerAppointments[0].id)}
    >
      Modifier le RDV
    </button>
    <button 
      className="cancel-appointment-button"
      onClick={() => handleCancelAppointment(providerAppointments[0].id)}
    >
      Annuler
    </button>
  </div>
)}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <p>Aucun prestataire n'a encore été accepté par le couple.</p>
                )}
              </div>

              {/* Liste de tous les rendez-vous */}
              {appointments.length > 0 && (
  <div className="all-appointments-section">
    <h3 className="appointments-title">Agenda des Rendez-vous</h3>
    <div className="appointments-timeline">
      {appointments
        .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
        .map(apt => (
          <div key={apt.id} className="timeline-item">
            <div className="timeline-date">
              <div className="timeline-day">
                {new Date(apt.date).toLocaleDateString('fr-FR', { day: 'numeric' })}
              </div>
              <div className="timeline-month">
                {new Date(apt.date).toLocaleDateString('fr-FR', { month: 'short' })}
              </div>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{apt.providerName} - {apt.providerType}</h4>
                <span className={`timeline-status ${getStatusColor(apt.status).replace('bg-', '')}`}>
                  {apt.status}
                </span>
              </div>
              <div className="timeline-details">
                <div className="timeline-time">
                  <Clock size={16} />
                  {apt.time} (Durée: {apt.duration} min)
                </div>
                {apt.location && (
                  <div className="timeline-location">
                    📍 {apt.location}
                  </div>
                )}
                {apt.notes && (
                  <div className="timeline-notes">
                    <div className="notes-label">Notes :</div>
                    <div>{apt.notes}</div>
                  </div>
                )}
              </div>
              <div className="timeline-actions">
              <button 
    className="edit-button"
    onClick={() => handleEditAppointment(apt.id)}
  >
    Modifier
  </button>
  <button 
    className="cancel-button"
    onClick={() => handleCancelAppointment(apt.id)}
  >
    Annuler
  </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
)}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div>
            <h2>Last Wedding Touch Up</h2>
            <div className="final-touch-container">
              <p>Cette section concernera les dernières touches à apporter au mariage avant le jour J.</p>
              
              <div className="summary-section">
                <h3>Récapitulatif final</h3>
                <div className="summary-cards">
                  <div className="confirmed-card">
                    <h4>Prestataires confirmés</h4>
                    {providers.filter(p => p.Status__c === 'Finished' && p.Couple_Response__c === 'Accepted').length > 0 ? (
                      <ul className="providers-summary-list">
                        {providers
                          .filter(p => p.Status__c === 'Finished' && p.Couple_Response__c === 'Accepted')
                          .map(provider => (
                            <li key={provider.Id} className="provider-summary-item">
                              <span>{provider.Name} ({provider.Type__c})</span>
                              <span className="confirmed-status">Confirmé</span>
                            </li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className="no-providers-message">Aucun prestataire n'est encore totalement confirmé.</p>
                    )}
                  </div>
                  
                  <div className="pending-card">
                    <h4>Prestataires en attente</h4>
                    {providers.filter(p => p.Status__c === 'Processing' && p.Couple_Response__c === 'Accepted').length > 0 ? (
                      <ul className="providers-summary-list">
                        {providers
                          .filter(p => p.Status__c === 'Processing' && p.Couple_Response__c === 'Accepted')
                          .map(provider => (
                            <li key={provider.Id} className="provider-summary-item">
                              <span>{provider.Name} ({provider.Type__c})</span>
                              <span className="pending-status">En cours</span>
                            </li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className="no-providers-message">Aucun prestataire n'est en attente de confirmation.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de planification de rendez-vous */}
      {showModal && (
        <div className="modal-overlay" onClick={closeAppointmentModal}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3> {appointments.some(apt => apt.providerId === selectedProvider?.Id) 
      ? "Modifier le rendez-vous" 
      : "Planifier un rendez-vous"} avec {selectedProvider?.Name}</h3>
              <button className="close-button" onClick={closeAppointmentModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-content">
              {/* Calendrier */}
              <div className="calendar-section">
  <div className="calendar-header">
    <button 
      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
      className="nav-button"
    >
      <ChevronLeft size={20} />
    </button>
    <h4 className="calendar-month-title">
      {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
    </h4>
    <button 
      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
      className="nav-button"
    >
      <ChevronRight size={20} />
    </button>
  </div>

  <div className="calendar-grid">
    <div className="calendar-weekdays">
      {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
        <div key={day} className="weekday">{day}</div>
      ))}
    </div>
    <div className="calendar-days-grid">
      {getDaysInMonth(currentDate).map((dayInfo, index) => {
        const { date, isCurrentMonth } = dayInfo;
        const isDisabled = isDateDisabled(date);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const hasAppointment = hasAppointmentOnDate(date);
        
        return (
          <div
            key={index}
            className={`calendar-day-container ${
              !isCurrentMonth ? 'other-month' : ''
            }`}
          >
            <button
              className={`calendar-day ${
                isDisabled ? 'disabled' : ''
              } ${isSelected ? 'selected' : ''} ${
                hasAppointment ? 'has-appointment' : ''
              }`}
              onClick={() => !isDisabled && isCurrentMonth && handleDateSelect(date)}
              disabled={isDisabled || !isCurrentMonth}
            >
              <span className="day-number">{date.getDate()}</span>
              {hasAppointment && (
                <span className="appointment-dot"></span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  </div>
</div>

              {/* Formulaire de détails */}
              {selectedDate && (
              // Remplacer la section du formulaire de rendez-vous
<div className="appointment-form">
  <h4 className="form-title">Détails du rendez-vous</h4>
  <div className="selected-date-info">
    <Calendar size={18} className="icon" />
    {selectedDate.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}
  </div>

  <div className="form-grid">
    <div className="form-group">
      <label>Heure du rendez-vous</label>
      <div className="select-wrapper">
        <select
          name="time"
          value={appointmentForm.time}
          onChange={handleAppointmentFormChange}
          required
        >
          <option value="">Sélectionner une heure</option>
          {Array.from({ length: 12 }, (_, i) => {
            const hour = i + 8; // De 8h à 19h
            return (
              <option key={hour} value={`${hour}:00`}>
                {hour}:00
              </option>
            );
          })}
        </select>
      </div>
    </div>

    <div className="form-group">
      <label>Durée</label>
      <div className="select-wrapper">
        <select
          name="duration"
          value={appointmentForm.duration}
          onChange={handleAppointmentFormChange}
        >
          <option value="30">30 minutes</option>
          <option value="60">1 heure</option>
          <option value="90">1h30</option>
          <option value="120">2 heures</option>
        </select>
      </div>
    </div>

    <div className="form-group full-width">
      <label>Lieu ou modalité</label>
      <input
        type="text"
        name="location"
        placeholder="Adresse physique ou lien visio"
        value={appointmentForm.location}
        onChange={handleAppointmentFormChange}
      />
    </div>

    <div className="form-group full-width">
      <label>Notes et objectifs</label>
      <textarea
        name="notes"
        placeholder="Points à aborder, préparations nécessaires..."
        value={appointmentForm.notes}
        onChange={handleAppointmentFormChange}
        rows="3"
      />
    </div>
  </div>

  <div className="form-actions">
    <button
      type="button"
      onClick={closeAppointmentModal}
      className="secondary-button"
    >
      Annuler
    </button>
    <button
      type="button"
      onClick={confirmAppointment}
      className="primary-button"
    >
      Confirmer le rendez-vous
    </button>
  </div>
</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeddingPlannerDashboard;