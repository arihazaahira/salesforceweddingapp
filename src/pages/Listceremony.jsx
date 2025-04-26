import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Calendar as CalendarIcon, Eye, Search, Moon, Sun } from 'lucide-react';
import CeremonyModal from './Addceremony';
import CoupleModal from './Addcouple';
import '../styles/Listceremony.css';

// Import du service pour récupérer les cérémonies
import { fetchAllCeremonies } from '../services/ListCeremonyService';

ChartJS.register(ArcElement, Tooltip, Legend);

const ListCeremony = () => {
  const [ceremonies, setCeremonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ceremonyModalOpen, setCeremonyModalOpen] = useState(false);
  const [coupleModalOpen, setCoupleModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Récupérer le mode de thème depuis localStorage au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  // Fonction pour basculer entre mode clair et sombre
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Configuration des statuts avec leurs couleurs distinctes - palette adaptée pour le mode sombre
  const getStatusConfig = () => {
    if (darkMode) {
      return {
        'En cours': { color: '#9f7aea', label: 'En cours' },     // Mauve moyen
        'Confirmé': { color: '#805ad5', label: 'Confirmé' },     // Mauve foncé
        'Annulé': { color: '#d6bcfa', label: 'Annulé' },         // Mauve clair
        'En attente': { color: '#b794f4', label: 'En attente' }, // Mauve
        'Non spécifié': { color: '#e9d8fd', label: 'Non spécifié' } // Mauve très clair
      };
    } else {
      return {
        'En cours': { color: '#2c5282', label: 'En cours' },
        'Confirmé': { color: '#3182ce', label: 'Confirmé' },
        'Annulé': { color: '#90cdf4', label: 'Annulé' },
        'En attente': { color: '#4299e1', label: 'En attente' },
        'Non spécifié': { color: '#bee3f8', label: 'Non spécifié' }
      };
    }
  };

  const statusConfig = getStatusConfig();

  useEffect(() => {
    const loadCeremonies = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCeremonies();
        // S'assurer que les données sont correctement formatées
        setCeremonies(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(`Erreur lors du chargement des données: ${err.message}`);
        setLoading(false);
      }
    };
    loadCeremonies();
  }, []);

  // Fonction pour filtrer les cérémonies selon le terme de recherche
  const filteredCeremonies = ceremonies.filter(item =>
    (item.Couple_name__c || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fonction pour générer les données du graphique
  const getStatusData = () => {
    if (!ceremonies || ceremonies.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [{ data: [1], backgroundColor: [darkMode ? '#e9d8fd' : '#bee3f8'] }]
      };
    }

    const statusCounts = ceremonies.reduce((acc, ceremony) => {
      const status = ceremony.Statut__c || 'Non spécifié';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statuses = Object.keys(statusCounts);
    
    return {
      labels: statuses.map(status => statusConfig[status]?.label || status),
      datasets: [
        {
          data: statuses.map(status => statusCounts[status]),
          backgroundColor: statuses.map(status => statusConfig[status]?.color || (darkMode ? '#e9d8fd' : '#bee3f8')),
          hoverBackgroundColor: statuses.map(status => `${statusConfig[status]?.color || (darkMode ? '#e9d8fd' : '#bee3f8')}dd`),
          borderWidth: 1,
          hoverBorderColor: darkMode ? "rgba(100, 100, 128, 1)" : "rgba(234, 236, 244, 1)",
        }
      ]
    };
  };

  // Options du graphique adaptées au mode
  const statusChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          color: darkMode ? '#e2e8f0' : '#2d3748'
        }
      },
      tooltip: {
        backgroundColor: darkMode ? "rgb(45, 55, 72)" : "rgb(255, 255, 255)",
        bodyColor: darkMode ? "#e2e8f0" : "#858796",
        borderColor: darkMode ? '#4a5568' : '#dddfeb',
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

  // Fonction pour filtrer les cérémonies selon la date sélectionnée
  const getCeremoniesForSelectedDate = () => {
    return ceremonies.filter(ceremony => {
      const ceremonyDate = new Date(ceremony.Date_and_Time__c);
      return (
        ceremonyDate.getDate() === selectedDate.getDate() &&
        ceremonyDate.getMonth() === selectedDate.getMonth() &&
        ceremonyDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const openCeremonyModal = () => setCeremonyModalOpen(true);
  const openCoupleModal = () => setCoupleModalOpen(true);

  // Gestionnaire de changement pour la barre de recherche
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <div className={`loading ${darkMode ? 'dark-theme' : ''}`}>Chargement des données...</div>;
  if (error) return <div className={`error ${darkMode ? 'dark-theme' : ''}`}>Erreur: {error}</div>;

  // Récupérer les cérémonies pour la date sélectionnée
  const ceremoniesOnSelectedDate = getCeremoniesForSelectedDate();

  return (
    <div className={`list-ceremony-container ${darkMode ? 'dark-theme' : ''}`}>
     
      
      <div className="header-container">
        <h1 className="title">Liste des Cérémonies</h1>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      {/* Barre de recherche */}
      <div className="search-container">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher une cérémonie par nom..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Tableau des cérémonies en haut */}
      <div className="all-ceremonies-section">
        <h2>Liste des Cérémonies ({filteredCeremonies.length})</h2>
        <div className="ceremonies-table-container">
          <table className="ceremonies-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date et Heure</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCeremonies.length > 0 ? (
                filteredCeremonies.map(ceremony => (
                  <tr key={ceremony.Id}>
                    <td>{ceremony.Couple_Name__c}</td>
                    <td>
                      {new Date(ceremony.Date_and_Time__c).toLocaleDateString()} {' '}
                      {new Date(ceremony.Date_and_Time__c).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: statusConfig[ceremony.Statut__c]?.color || statusConfig['Non spécifié'].color }}
                      >
                        {ceremony.Statut__c || 'Non spécifié'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-details" onClick={() => navigate(`/ceremony/${ceremony.Id}`)}>
                        <Eye size={16} /> Détails
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    {searchTerm ? `Aucune cérémonie trouvée pour "${searchTerm}"` : 'Aucune cérémonie trouvée'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section avec graphique et calendrier côte à côte en bas */}
      <div className="dashboard-row">
        <div className="stats-section">
          <h2>Statut des Mariages</h2>
          <div className="chart-container">
            <Pie data={getStatusData()} options={statusChartOptions} />
          </div>
          <div className="status-legend">
            {Object.entries(ceremonies.reduce((acc, ceremony) => {
              const status = ceremony.Statut__c || 'Non spécifié';
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            }, {})).map(([status, count]) => (
              <div key={status} className="status-item">
                <span 
                  className="status-color" 
                  style={{ backgroundColor: statusConfig[status]?.color || statusConfig['Non spécifié'].color }}
                ></span>
                <span className="status-name">{statusConfig[status]?.label || status}</span>
                <span className="status-count">{count}</span>
                <span className="status-percent">
                  ({ceremonies.length > 0 ? Math.round((count / ceremonies.length) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-section">
          <h2>Calendrier des Mariages</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className={darkMode ? 'dark-calendar' : ''}
          />

          <div className="ceremonies-on-date">
            <h3>Cérémonies du {selectedDate.toLocaleDateString()}</h3>
            {ceremoniesOnSelectedDate.length > 0 ? (
              <ul className="date-ceremonies-list">
                {ceremoniesOnSelectedDate.map(ceremony => (
                  <li key={ceremony.Id} className="date-ceremony-item">
                    <span className="ceremony-info">
                      <strong>{ceremony.Name}</strong>
                      <span>{new Date(ceremony.Date_and_Time__c).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: statusConfig[ceremony.Statut__c]?.color || statusConfig['Non spécifié'].color }}
                      >
                        {ceremony.Statut__c || 'Non spécifié'}
                      </span>
                    </span>
                    <button className="btn-details-small" onClick={() => navigate(`/ceremony/${ceremony.Id}`)}>
                      Détails
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-ceremonies">Aucune cérémonie prévue cette journée</p>
            )}
          </div>
        </div>
      </div>
      
      {ceremonyModalOpen && (
        <CeremonyModal 
          isOpen={ceremonyModalOpen} 
          onClose={() => setCeremonyModalOpen(false)}
          onSave={(newCeremony) => {
            // Mettre à jour les cérémonies après ajout
            setCeremonies([...ceremonies, newCeremony]);
            setCeremonyModalOpen(false);
          }}
          darkMode={darkMode}
        />
      )}
      
      {coupleModalOpen && (
        <CoupleModal 
          isOpen={coupleModalOpen} 
          onClose={() => setCoupleModalOpen(false)}
          darkMode={darkMode} 
        />
      )}
    </div>
  );
};

export default ListCeremony;