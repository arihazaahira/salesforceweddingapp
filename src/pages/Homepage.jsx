import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRing, FaCalendarAlt, FaPlus, FaArrowRight } from 'react-icons/fa';
import Footer from '../components/Footer';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Hero Section */}
        <div className="relative h-screen w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/Home_bg.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-white text-center z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Votre Mariage de Rêve Commence Ici
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl opacity-90">
          Planifiez chaque détail avec élégance et simplicité
            </p>
            <button
          onClick={() => {
            document.querySelector('.grid').scrollIntoView({ 
              behavior: 'smooth'
            });
          }}
          className="mt-8 px-8 py-3 bg-white text-purple-700 rounded-full font-semibold shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1 flex items-center"
            >
          Commencer <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* Features Section with improved cards */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Tout ce qu'il vous faut pour un mariage parfait</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Ceremony Feature */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <FaRing className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Créez Votre Cérémonie</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Organisez le déroulement parfait de votre journée spéciale avec tous les détails importants.</p>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={() => navigate('/addceremony')}
                className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
              >
                <FaPlus className="mr-2" /> Ajouter une Cérémonie
              </button>
            </div>
          </div>

          {/* Couple Feature */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 flex items-center justify-center mb-6">
                <FaHeart className="text-pink-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Enregistrez Votre Couple</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Créez et personnalisez le profil de votre couple pour votre grand jour.</p>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={() => navigate('/addcouple')}
                className="flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-medium"
              >
                <FaPlus className="mr-2" /> Ajouter un Couple
              </button>
            </div>
          </div>

          {/* Ceremonies List Feature */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <FaCalendarAlt className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Vos Cérémonies</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Visualisez, gérez et suivez tous les détails de vos cérémonies en un seul endroit.</p>
            </div>
            <div className="px-8 pb-8">
              <button
                onClick={() => navigate('/listceremony')}
                className="flex items-center justify-center w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all font-medium"
              >
                <FaCalendarAlt className="mr-2" /> Voir les Cérémonies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with improved design */}
      <Footer />
    </div>
  );
};

export default Homepage;