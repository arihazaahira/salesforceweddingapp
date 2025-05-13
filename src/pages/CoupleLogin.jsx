import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">Connexion des Couples</h2>
        <p className="text-center text-gray-500 mb-8">Connectez-vous pour gérer votre mariage</p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="exemple@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              placeholder="Votre mot de passe"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl transition duration-300 font-semibold"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Vous n'avez pas de compte ? <a href="/register" className="text-pink-600 font-medium hover:underline">Créer un compte</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
