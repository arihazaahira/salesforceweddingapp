import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllCeremonies } from '../services/ListCeremonyService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/Listceremony.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ListCeremony = () => {
  const [ceremonies, setCeremonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // Mapping des statuts de la picklist avec leurs couleurs correspondantes
  const statusConfig = {
    'En cours': { color: '#4e73df', label: 'En cours' },
    'Confirmé': { color: '#1cc88a', label: 'Confirmé' },
    'Annulé': { color: '#e74a3b', label: 'Annulé' },
    'Non spécifié': { color: '#858796', label: 'Non spécifié' }
  };

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

  // Préparation des données pour le graphique
  const getStatusData = () => {
    const statusCounts = ceremonies.reduce((acc, ceremony) => {
      const status = ceremony.Statut__c || 'Non spécifié';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Ordonner les statuts selon l'ordre de la picklist
    const orderedStatuses = Object.keys(statusConfig).filter(status => status in statusCounts);
    
    return {
      labels: orderedStatuses.map(status => statusConfig[status].label),
      datasets: [
        {
          data: orderedStatuses.map(status => statusCounts[status]),
          backgroundColor: orderedStatuses.map(status => statusConfig[status].color),
          hoverBackgroundColor: orderedStatuses.map(status => `${statusConfig[status].color}cc`),
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }
      ]
    };
  };

  const statusChartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: "rgb(255,255,255)",
        bodyColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        padding: 15,
        displayColors: true,
        caretPadding: 10,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };

  // Fonctions pour le calendrier...
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasCeremony = ceremonies.some(ceremony => {
        const ceremonyDate = new Date(ceremony.Date_and_Time__c);
        return (
          date.getDate() === ceremonyDate.getDate() &&
          date.getMonth() === ceremonyDate.getMonth() &&
          date.getFullYear() === ceremonyDate.getFullYear()
        );
      });
      return hasCeremony ? <div className="ceremony-dot"></div> : null;
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasCeremony = ceremonies.some(ceremony => {
        const ceremonyDate = new Date(ceremony.Date_and_Time__c);
        return (
          date.getDate() === ceremonyDate.getDate() &&
          date.getMonth() === ceremonyDate.getMonth() &&
          date.getFullYear() === ceremonyDate.getFullYear()
        );
      });
      return hasCeremony ? 'has-ceremony' : '';
    }
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="list-ceremony-container">
      <h1 className="title">Liste des Cérémonies</h1>
      
      <div className="dashboard-row">
        <div className="calendar-section">
          <h2>Calendrier des Mariages</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
          />
          
          <div className="ceremonies-on-date">
            <h3>Cérémonies du {selectedDate.toLocaleDateString()}</h3>
            {ceremonies.filter(ceremony => {
              const ceremonyDate = new Date(ceremony.Date_and_Time__c);
              return (
                ceremonyDate.getDate() === selectedDate.getDate() &&
                ceremonyDate.getMonth() === selectedDate.getMonth() &&
                ceremonyDate.getFullYear() === selectedDate.getFullYear()
              );
            }).length > 0 ? (
              <ul>
                {ceremonies.filter(ceremony => {
                  const ceremonyDate = new Date(ceremony.Date_and_Time__c);
                  return (
                    ceremonyDate.getDate() === selectedDate.getDate() &&
                    ceremonyDate.getMonth() === selectedDate.getMonth() &&
                    ceremonyDate.getFullYear() === selectedDate.getFullYear()
                  );
                }).map(ceremony => (
                  <li key={ceremony.Id}>
                    <span className="ceremony-info">
                      <strong>{ceremony.Name}</strong>
                      <span>{new Date(ceremony.Date_and_Time__c).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span 
                        className="status-badge" 
                        style={{ 
                          backgroundColor: statusConfig[ceremony.Statut__c]?.color || statusConfig['Non spécifié'].color
                        }}
                      >
                        {ceremony.Statut__c || 'Non spécifié'}
                      </span>
                    </span>
                    <button
                      className="btn-details-small"
                      onClick={() => navigate(`/ceremony/${ceremony.Id}`)}
                    >
                      Détails
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune cérémonie prévue cette journée</p>
            )}
          </div>
        </div>

        <div className="stats-section">
          <h2>Statut des Mariages</h2>
          <div className="chart-container">
            <Pie data={getStatusData()} options={statusChartOptions} />
          </div>
          <div className="stats-summary">
            <h3>Répartition des {ceremonies.length} cérémonies</h3>
            <ul className="status-list">
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = ceremonies.filter(c => c.Statut__c === status).length;
                if (count === 0 && status === 'Non spécifié') return null;
                return (
                  <li key={status}>
                    <span className="status-color" style={{ backgroundColor: config.color }}></span>
                    <span className="status-name">{config.label}</span>
                    <span className="status-count">{count}</span>
                    <span className="status-percent">
                      ({ceremonies.length > 0 ? Math.round((count / ceremonies.length) * 100) : 0}%)
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <table className="ceremony-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Date et Heure</th>
            <th>Lieu</th>
            <th>Statut</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ceremonies.map(ceremony => (
            <tr key={ceremony.Id}>
              <td>{ceremony.Id}</td>
              <td>{ceremony.Name}</td>
              <td>{new Date(ceremony.Date_and_Time__c).toLocaleString()}</td>
              <td>{ceremony.Location__c || '-'}</td>
              <td>
                <span 
                  className="status-badge" 
                  style={{ 
                    backgroundColor: statusConfig[ceremony.Statut__c]?.color || statusConfig['Non spécifié'].color
                  }}
                >
                  {ceremony.Statut__c || 'Non spécifié'}
                </span>
              </td>
              <td>{ceremony.Description__c || '-'}</td>
              <td>
                <button
                  className="btn-details"
                  onClick={() => navigate(`/ceremony/${ceremony.Id}`)}
                >
                  Voir Détails
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCeremony;