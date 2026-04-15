// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenTool, Menu, X, User, LogOut, Settings, FileText, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/auth';
import { isAdmin } from '../services/admin';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const { currentUser, userDocument } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white shadow-soft border-b border-[#e5e7eb]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary-900">DraftEngine</h1>
              <p className="text-xs text-primary font-medium hidden sm:block">
                AI Writing Assistant
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Dashboard
                </Link>
                <Link to="/create" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Create Entry
                </Link>
                <Link to="/features" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Features
                </Link>
                <Link to="/pricing" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Pricing
                </Link>
                <Link to="/feeds" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Research Feeds
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-secondary-700 hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{currentUser.displayName || 'User'}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-[#e5e7eb] py-2"
                      >
                        <div className="px-4 py-2 border-b border-[#e5e7eb]">
                          <p className="text-sm font-medium text-secondary-900">{currentUser.displayName}</p>
                          <p className="text-xs text-secondary-600">{currentUser.email}</p>
                          {userDocument?.subscription && (
                            <p className="text-xs text-primary font-medium capitalize">
                              {userDocument.subscription.plan} Plan
                            </p>
                          )}
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>My Entries</span>
                        </Link>
                        <Link
                          to="/content/history"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Content History</span>
                        </Link>
                        {isAdmin(currentUser) && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors border-t border-[#e5e7eb]"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-gray-50 transition-colors w-full text-left border-t border-[#e5e7eb]"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/features" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
                  Features
                </Link>
                <Link to="/pricing" className="text-secondary-700 hover:text-primary transition-colors font-medium text-sm">
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
            className="md:hidden p-2 text-secondary-700 hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-4 py-4 border-t border-[#e5e7eb]">
                <div className="space-y-4">
                  {currentUser ? (
                    <>
                      <Link to="/dashboard" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/create" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Create Entry</Link>
                      <Link to="/features" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Features</Link>
                      <Link to="/pricing" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                      <Link to="/feeds" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Research Feeds</Link>
                      <Link to="/profile" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                      <button onClick={handleLogout} className="block text-secondary-700 hover:text-primary transition-colors font-medium text-left">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/features" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Features</Link>
                      <Link to="/pricing" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                      <Link to="/login" className="block text-secondary-700 hover:text-primary transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                      <Link to="/signup" className="btn btn-primary w-full justify-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
