import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, LogOut, User, Home, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Droplets className="h-8 w-8" />
            <span>SepticClean</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Beranda</span>
            </Link>
            <Link to="/services" className="hover:text-blue-200 transition-colors">
              Layanan
            </Link>
            <Link to="/order" className="hover:text-blue-200 transition-colors">
              Pesan Sekarang
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-blue-200 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;