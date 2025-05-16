import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Logincouple.css';

function LoginForm() {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = "00DgK0000029e5F!AQEAQMeSddtqm3RxaF_85l90E_ve0_1CnTdKtlbLS3inkEXJh3j_wUB7Lk9nLUi79qroLy1DRh4DIz56su6G4l_dl2KPvPe_";
    const instanceUrl = 'https://orgfarm-c407668048-dev-ed.develop.my.salesforce.com';

    try {
      const query = `SELECT Id, Mot_de_passe__c FROM Login_Couple__c WHERE Name = '${loginName.trim()}' AND Mot_de_passe__c = '${password.trim()}'`;
      
      console.log('Query:', query); // Log la requête pour le débogage

      const response = await axios.get(
        `${instanceUrl}/services/data/v59.0/query`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: query,
          },
        }
      );

      if (response.data.totalSize > 0) {
        const couplePassword = response.data.records[0].Mot_de_passe__c; // Récupère le mot de passe du couple
        const coupleName = couplePassword.slice(7); ; // Extrait le nom du couple (après le premier tiret)

        // Rediriger vers /coupleform et passer le coupleName comme données d'état
        navigate('/coupleform', { state: { coupleName } });
      } else {
        setError('Nom ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err.response || err.message);
      setError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Connexion Couple</h2>
      <input
        type="text"
        placeholder="Login Couple Name"
        value={loginName}
        onChange={(e) => setLoginName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default LoginForm;
