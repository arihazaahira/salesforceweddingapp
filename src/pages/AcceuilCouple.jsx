import React, { useState } from 'react';
import { Heart, X, Calendar, Music, Camera, Utensils, MapPin, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WeddingHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };
  
  const handleConsultationRequest = () => {
    scrollToSection('consultation');
  };
  
  const redirectToLogin = () => {
    navigate('/couplelogin');
  };

  const testimonials = [
    {
      name: "Sara & Younes",
      comment: "Un service extraordinaire! Notre mariage était parfait dans les moindres détails.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "Amina & Karim",
      comment: "L'équipe a créé une ambiance magique pour notre cérémonie traditionnelle marocaine.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
    {
      name: "Leila & Mehdi",
      comment: "De la salle au DJ, tout était coordonné parfaitement. Merci pour ces souvenirs inoubliables!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80"
    },
  ];
  
  const services = [
    {
      icon: <MapPin className="h-12 w-12 text-red-600" />,
      title: "Lieux de réception",
      description: "Nous travaillons avec les plus beaux lieux de réception traditionnels et modernes au Maroc."
    },
    {
      icon: <Music className="h-12 w-12 text-blue-600" />,
      title: "DJ & Animation",
      description: "Nos DJs professionnels créent l'ambiance parfaite mélangeant musique traditionnelle et moderne."
    },
    {
      icon: <Camera className="h-12 w-12 text-green-600" />,
      title: "Photographie",
      description: "Nos photographes capturent chaque moment précieux de votre journée spéciale."
    },
    {
      icon: <Utensils className="h-12 w-12 text-yellow-600" />,
      title: "Traiteur",
      description: "Découvrez nos menus de cuisine marocaine traditionnelle et fusion pour votre réception."
    },
    {
      icon: <Calendar className="h-12 w-12 text-purple-600" />,
      title: "Planification complète",
      description: "Notre équipe s'occupe de tous les détails pour un mariage sans stress."
    },
  ];
  
  const galleryImages = [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
    "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80",
  ];
  
  return (
    <div className="relative font-sans">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-2xl font-bold text-gray-800">MonMariage</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => scrollToSection('hero')} 
              className={`font-medium ${activeSection === 'hero' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Accueil
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className={`font-medium ${activeSection === 'services' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('gallery')} 
              className={`font-medium ${activeSection === 'gallery' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Galerie
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className={`font-medium ${activeSection === 'testimonials' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            >
              Témoignages
            </button>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={redirectToLogin} 
              className="hidden md:flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden flex items-center"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <div className="space-y-1">
                  <div className="w-6 h-0.5 bg-gray-800"></div>
                  <div className="w-6 h-0.5 bg-gray-800"></div>
                  <div className="w-6 h-0.5 bg-gray-800"></div>
                </div>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => scrollToSection('hero')} 
                className="font-medium text-left py-2 border-b border-gray-100"
              >
                Accueil
              </button>
              <button 
                onClick={() => scrollToSection('services')} 
                className="font-medium text-left py-2 border-b border-gray-100"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('gallery')} 
                className="font-medium text-left py-2 border-b border-gray-100"
              >
                Galerie
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="font-medium text-left py-2 border-b border-gray-100"
              >
                Témoignages
              </button>
              <button 
                onClick={redirectToLogin}
                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-red-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Votre mariage de rêve <span className="text-red-600">parfaitement organisé</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Notre équipe s'occupe de tous les aspects de votre célébration, 
                pour un mariage marocain authentique et inoubliable.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Découvrir nos services
                </button>
                <button 
                  onClick={handleConsultationRequest}
                  className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Réserver une consultation
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Mariage traditionnel marocain" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-lg font-semibold">Mariage traditionnel marocain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour votre mariage. Nous coordonnons tous les aspects 
              pour créer une expérience sans stress et mémorable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={handleConsultationRequest}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réserver une consultation
            </button>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section id="gallery" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Galerie de Mariages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les moments magiques des mariages marocains que nous avons organisés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={image} 
                  alt={`Mariage marocain ${index + 1}`} 
                  className="w-full h-64 object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Témoignages de Couples</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos clients disent de notre service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Consultation Form Section */}
      <section id="consultation" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Demande de Consultation</h2>
              <p className="text-gray-600">Planifiez une consultation avec notre équipe via notre système de réservation</p>
            </div>
            
            {/* Intégration de Woho Booking */}
            <div className="w-full">
              <iframe 
                width='100%' 
                height='750px' 
                src='https://weddingapp.zohobookings.com/portal-embed#/weddingapp' 
                frameBorder='0' 
                allowFullScreen
                className="border-0 rounded-lg"
              ></iframe>
            </div>
            
            <div className="mt-6 text-center text-gray-600">
              <p>Si vous avez des questions spécifiques, n'hésitez pas à nous contacter directement.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-2xl font-bold">MonMariage</span>
              </div>
              <p className="mt-2 text-gray-400 max-w-xs">
                Nous créons des expériences de mariage uniques et inoubliables pour nos clients.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Navigation</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('hero')} className="text-gray-400 hover:text-white">Accueil</button></li>
                  <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white">Services</button></li>
                  <li><button onClick={() => scrollToSection('gallery')} className="text-gray-400 hover:text-white">Galerie</button></li>
                  <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white">Témoignages</button></li>
                  <li><button onClick={() => scrollToSection('consultation')} className="text-gray-400 hover:text-white">Consultation</button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">+212 5XX XX XX XX</li>
                  <li className="text-gray-400">info@monmariage.ma</li>
                  <li className="text-gray-400">Casablanca, Maroc</li>
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-lg font-semibold mb-3">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.66 6.51a3.06 3.06 0 0 0-3.06-3.06H8.4a3.06 3.06 0 0 0-3.06 3.06v9.2a3.06 3.06 0 0 0 3.06 3.06h7.2a3.06 3.06 0 0 0 3.06-3.06V6.51zm-3.06 10.8H8.4a1.54 1.54 0 0 1-1.54-1.54V6.51a1.54 1.54 0 0 1 1.54-1.54h7.2a1.54 1.54 0 0 1 1.54 1.54v9.2a1.54 1.54 0 0 1-1.54 1.6z" />
                      <path d="M12 15.82a3.82 3.82 0 1 0-3.82-3.82A3.82 3.82 0 0 0 12 15.82zm0-6.17a2.34 2.34 0 1 1-2.34 2.34A2.34 2.34 0 0 1 12 9.65z" />
                      <circle cx="16.06" cy="7.71" r="0.86" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} MonMariage. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}