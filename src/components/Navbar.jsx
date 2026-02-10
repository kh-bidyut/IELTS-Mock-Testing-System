import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-blue-600 text-white font-bold text-xl px-3 py-2 rounded-lg">
                IELTS
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 hidden sm:block">
                Mock Testing
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {isAdmin && (
                  <div className="relative">
                    <button 
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                      onMouseEnter={() => setIsAdminDropdownOpen(true)}
                      onMouseLeave={() => setIsAdminDropdownOpen(false)}
                    >
                      Admin
                      <svg className={`ml-1 w-4 h-4 transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div 
                      className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 z-50 ${
                        isAdminDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                      onMouseEnter={() => setIsAdminDropdownOpen(true)}
                      onMouseLeave={() => setIsAdminDropdownOpen(false)}
                    >
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/test-management" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        Test Management
                      </Link>
                      <Link 
                        to="/user-management" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        User Management
                      </Link>
                      <Link 
                        to="/database" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        Database Dashboard
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <img 
                      src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=3b82f6&color=fff`} 
                      alt={user?.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {user?.name}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {isAdmin && (
                  <div className="relative">
                    <button 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left flex justify-between items-center"
                      onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                    >
                      Admin
                      <svg className={`w-4 h-4 ml-1 transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`mt-2 space-y-1 ${isAdminDropdownOpen ? 'block' : 'hidden'}`}>
                      <Link 
                        to="/admin" 
                        className="block px-6 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/test-management" 
                        className="block px-6 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        Test Management
                      </Link>
                      <Link 
                        to="/user-management" 
                        className="block px-6 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        User Management
                      </Link>
                      <Link 
                        to="/database" 
                        className="block px-6 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsAdminDropdownOpen(false);
                        }}
                      >
                        Database Dashboard
                      </Link>
                    </div>
                  </div>
                )}
                
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;