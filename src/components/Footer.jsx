import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-6">
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