import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaHeart, FaBars, FaSun, FaMoon, FaHome, FaCalendarPlus, FaUsers, FaList } from 'react-icons/fa';

const Headers = ({ toggleSidebar, openCeremonyModal, openCoupleModal }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current route is ListCeremony
  const isListCeremoniesRoute = location.pathname === '/listceremony';

  // Check for user preference in local storage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
    // Add scroll event listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle ceremony link/button click
  const handleCeremonyClick = (e) => {
    e.preventDefault();
    if (openCeremonyModal) {
      openCeremonyModal();
    }
    setMobileMenuOpen(false);
  };

  // Handle couple link/button click
  const handleCoupleClick = (e) => {
    e.preventDefault();
    if (openCoupleModal) {
      openCoupleModal();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-white dark:bg-gray-800 shadow-md' 
        : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg">
                <FaHeart className="h-5 w-5" />
              </div>
              <span className="ml-2 text-xl font-bold text-pink-600 dark:text-pink-400">Wedding Planner</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                  ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                  : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                } flex items-center`
              }
            >
              <FaHome className="mr-2 text-pink-600 dark:text-pink-400" />
              Accueil
            </NavLink>
            
            <a 
              href="#" 
              onClick={handleCeremonyClick}
              className={`px-3 py-2 rounded-lg transition-colors hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center`}
            >
              <FaCalendarPlus className="mr-2 text-pink-600 dark:text-pink-400" />
              Ajouter Cérémonie
            </a>
            
            <a 
              href="#" 
              onClick={handleCoupleClick}
              className={`px-3 py-2 rounded-lg transition-colors hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center`}
            >
              <FaUsers className="mr-2 text-pink-600 dark:text-pink-400" />
              Ajouter Couple
            </a>
            
            {!isListCeremoniesRoute && (
              <NavLink 
                to="/listceremony" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                    : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  } flex items-center`
                }
              >
                <FaList className="mr-2 text-pink-600 dark:text-pink-400" />
                Liste Cérémonies
              </NavLink>
            )}
          </nav>
          
          {/* Right side - Dark Mode toggle and mobile menu button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm transition-all"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? 
                <FaSun className="text-yellow-400 h-5 w-5" /> : 
                <FaMoon className="text-indigo-600 h-5 w-5" />
              }
            </button>
            
            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <nav className="flex flex-col space-y-1 px-2 pb-3 pt-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                    ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                    : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  } flex items-center`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="mr-2 text-pink-600 dark:text-pink-400" />
                Accueil
              </NavLink>
              
              <a 
                href="#" 
                onClick={handleCeremonyClick}
                className={`px-3 py-2 rounded-lg transition-colors hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center`}
              >
                <FaCalendarPlus className="mr-2 text-pink-600 dark:text-pink-400" />
                Ajouter Cérémonie
              </a>
              
              <a 
                href="#" 
                onClick={handleCoupleClick}
                className={`px-3 py-2 rounded-lg transition-colors hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center`}
              >
                <FaUsers className="mr-2 text-pink-600 dark:text-pink-400" />
                Ajouter Couple
              </a>
              
              {!isListCeremoniesRoute && (
                <NavLink 
                  to="/listceremony" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                      ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400' 
                      : 'hover:bg-pink-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    } flex items-center`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaList className="mr-2 text-pink-600 dark:text-pink-400" />
                  Liste Cérémonies
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Headers;