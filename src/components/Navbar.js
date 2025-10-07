// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Menu, X, User, LogOut, Settings, FileText, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/auth';
import { isAdmin } from '../services/admin';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { currentUser, userDocument } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMenuOpen(false);
      }
    };

    if (isProfileOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen, isMenuOpen]);

  useEffect(() => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      await logOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-chestnut rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-charcoal font-playfair">ScholarlyAI</h1>
              <p className="text-xs text-chestnut font-medium font-lato hidden sm:block">
                Intelligent Bibliography Generation
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/create" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Create Entry
                </Link>
                <Link to="/features" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Features
                </Link>
                <Link to="/pricing" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Pricing
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-charcoal hover:text-chestnut transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-chestnut rounded-full flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{currentUser.displayName || 'User'}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg border border-white/20 py-2">
                      <div className="px-4 py-2 border-b border-white/20">
                        <p className="text-sm font-medium text-charcoal">{currentUser.displayName}</p>
                        <p className="text-xs text-charcoal/60">{currentUser.email}</p>
                        {userDocument?.subscription && (
                          <p className="text-xs text-chestnut font-medium capitalize">
                            {userDocument.subscription.plan} Plan
                          </p>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-charcoal hover:bg-white/20 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-charcoal hover:bg-white/20 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FileText className="w-4 h-4" />
                        <span>My Entries</span>
                      </Link>
                      {isAdmin(currentUser) && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-charcoal hover:bg-white/20 transition-colors border-t border-white/20"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-charcoal hover:bg-white/20 transition-colors w-full text-left border-t border-white/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/features" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Features
                </Link>
                <Link to="/pricing" className="text-charcoal hover:text-chestnut transition-colors font-medium">
                  Pricing
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-charcoal hover:text-chestnut transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/20">
            <div className="space-y-4">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Entry
                  </Link>
                  <Link
                    to="/features"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    to="/pricing"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/profile"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/features"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    to="/pricing"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    to="/login"
                    className="block text-charcoal hover:text-chestnut transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;