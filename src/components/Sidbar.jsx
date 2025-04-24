import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Heart, Users } from 'lucide-react';

export default function Sidbar({ isOpen }) {
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode preference in local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  return (
    <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 w-64 transition-colors`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg">
            <Heart size={24} />
          </div>
          <h1 className="ml-3 text-xl font-bold text-pink-600 dark:text-pink-400">Wedding Planner</h1>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                  : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`
              }
            >
              <Home size={20} className="text-pink-600 dark:text-pink-400" />
              <span className="ml-3">Accueil</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add-ceremony" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                  : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`
              }
            >
              <Calendar size={20} className="text-pink-600 dark:text-pink-400" />
              <span className="ml-3">Ajouter Cérémonie</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add-couple" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                  : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`
              }
            >
              <Heart size={20} className="text-pink-600 dark:text-pink-400" />
              <span className="ml-3">Ajouter Couple</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/list-ceremonies" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                  : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`
              }
            >
              <Users size={20} className="text-pink-600 dark:text-pink-400" />
              <span className="ml-3">Liste Cérémonies</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}