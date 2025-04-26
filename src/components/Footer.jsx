import React, { useEffect, useState } from 'react';

const Footer = () => {
    const [darkMode, setDarkMode] = useState(false);

    // Check for dark mode preference in local storage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
    }, []);

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white relative">
            {/* Separator line - visible only in dark mode */}
            <div className="hidden dark:block w-full h-px bg-gray-700 absolute top-0 left-0"></div>
            
            <div className="py-12 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h4 className="text-2xl font-bold">Planificateur de Mariage Élégant</h4>
                        <p className="text-gray-400 mt-2">Votre partenaire pour un mariage parfait</p>
                    </div>
                    <div className="text-gray-400">
                        <p>© {new Date().getFullYear()} Tous droits réservés</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;