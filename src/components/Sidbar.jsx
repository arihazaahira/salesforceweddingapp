import { NavLink } from 'react-router-dom';
import { Home, Calendar, Heart, Users } from 'lucide-react';

export default function Sidbar({ isOpen }) {
  return (
    <aside className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20 w-64`}>
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg">
            <Heart size={24} />
          </div>
          <h1 className="ml-3 text-xl font-bold text-pink-600">Wedding Planner</h1>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className="flex items-center p-2 rounded-lg hover:bg-pink-50">
              <Home size={20} className="text-pink-600" />
              <span className="ml-3">Accueil</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-ceremony" className="flex items-center p-2 rounded-lg hover:bg-pink-50">
              <Calendar size={20} className="text-pink-600" />
              <span className="ml-3">Ajouter Cérémonie</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/add-couple" className="flex items-center p-2 rounded-lg hover:bg-pink-50">
              <Heart size={20} className="text-pink-600" />
              <span className="ml-3">Ajouter Couple</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/list-ceremonies" className="flex items-center p-2 rounded-lg hover:bg-pink-50">
              <Users size={20} className="text-pink-600" />
              <span className="ml-3">Liste Cérémonies</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}