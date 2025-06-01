import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const CoupleLogin = () => {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Redirection spéciale pour weddingplanner
    if (
      loginName.trim().toLowerCase() === 'weddingplanner@gmail.com' &&
      password.trim() === 'weddingplanner'
    ) {
      window.location.href = 'http://localhost:3000/';
      return;
    }

    const accessToken = process.env.REACT_APP_SF_ACCESS_TOKEN;
    const instanceUrl = process.env.REACT_APP_SF_INSTANCE_URL;

    try {
      const query = `SELECT Id, Mot_de_passe__c FROM Login_Couple__c WHERE Name = '${loginName.trim()}' AND Mot_de_passe__c = '${password.trim()}'`;

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
        const couplePassword = response.data.records[0].Mot_de_passe__c;
        const coupleName = couplePassword.slice(7);
        navigate('/coupleform', { state: { coupleName } });
      } else {
        setError('Nom ou mot de passe incorrect.');
      }
    } catch (err) {
      console.error('Erreur lors de la connexion:', err.response || err.message);
      setError('Erreur de connexion au serveur. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <LogIn className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion Couple
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez vos identifiants pour accéder à votre espace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="loginName" className="block text-sm font-medium text-gray-700">
                Nom du couple
              </label>
              <input
                id="loginName"
                name="loginName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Votre nom de couple"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                'Connexion en cours...'
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-red-300 group-hover:text-red-200" />
                  </span>
                  Se connecter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoupleLogin;
