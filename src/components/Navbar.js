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

  const linkClass = "text-secondary-600 hover:text-secondary-900 transition-colors font-medium text-sm";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-150 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-secondary-200'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
            </div>
            <span className="text-[15px] font-semibold text-secondary-900 tracking-tight">DraftEngine</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {currentUser ? (
              <>
                <Link to="/dashboard" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Dashboard
                </Link>
                <Link to="/feeds" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Research Feeds
                </Link>
                <Link to="/pricing" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Pricing
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary-100 transition-colors"
                  >
                    <div className="w-7 h-7 bg-secondary-200 rounded-full flex items-center justify-center overflow-hidden">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-secondary-600" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-menu py-1.5 overflow-hidden"
                      >
                        <div className="px-3 py-2.5 border-b border-secondary-100">
                          <p className="text-sm font-medium text-secondary-900 truncate">{currentUser.displayName || 'User'}</p>
                          <p className="text-xs text-secondary-500 truncate">{currentUser.email}</p>
                          {userDocument?.subscription && (
                            <span className="mt-1.5 inline-block badge badge-brand capitalize">
                              {userDocument.subscription.plan}
                            </span>
                          )}
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-secondary-500" />
                            <span>Settings</span>
                          </Link>
                          <Link
                            to="/sources"
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-4 h-4 text-secondary-500" />
                            <span>Source Library</span>
                          </Link>
                          <Link
                            to="/content/history"
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-4 h-4 text-secondary-500" />
                            <span>Content History</span>
                          </Link>
                          {isAdmin(currentUser) && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Shield className="w-4 h-4 text-secondary-500" />
                              <span>Admin</span>
                            </Link>
                          )}
                        </div>
                        <div className="py-1 border-t border-secondary-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4 text-secondary-500" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/features" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Features
                </Link>
                <Link to="/pricing" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Pricing
                </Link>
                <Link to="/docs" className={`${linkClass} px-3 py-1.5 rounded-md hover:bg-secondary-100`}>
                  Docs
                </Link>
                <div className="w-px h-5 bg-secondary-200 mx-2" />
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 border-t border-secondary-200">
                <div className="flex flex-col gap-1">
                  {currentUser ? (
                    <>
                      <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/feeds" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Research Feeds</Link>
                      <Link to="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                      <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                      <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100 text-left">Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/features" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Features</Link>
                      <Link to="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                      <Link to="/docs" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Docs</Link>
                      <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-secondary-700 hover:bg-secondary-100" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                      <Link to="/signup" className="btn btn-primary mt-1" onClick={() => setIsMenuOpen(false)}>Get started</Link>
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
