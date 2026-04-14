// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Brain, Shield, Users } from 'lucide-react';
import { signIn, signInWithGoogle } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ScaleIn } from '../components/motion';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in (but not during Google OAuth redirect processing)
  React.useEffect(() => {
    if (currentUser) {
      // Only redirect if we're not in the middle of processing a Google OAuth redirect
      const isGoogleRedirect = window.location.search.includes('code=') ||
                              window.location.search.includes('state=') ||
                              document.referrer.includes('accounts.google.com');

      if (!isGoogleRedirect) {
        navigate(from, { replace: true });
      }
    }
  }, [currentUser, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error(error);
      } else {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      console.log('Starting Google sign-in from LoginPage');
      const { user, error } = await signInWithGoogle();

      if (error) {
        console.error('Google sign-in error in LoginPage:', error);
        toast.error(error);
        setIsLoading(false);
      } else if (user) {
        // Popup method succeeded - user is available immediately
        toast.success('Welcome!');
        navigate(from, { replace: true });
      } else {
        // Redirect method initiated - don't set loading to false yet
        console.log('Google sign-in initiated, waiting for redirect...');
        // Note: isLoading will remain true during redirect
      }
    } catch (error) {
      console.error('Unexpected error in handleGoogleSignIn:', error);
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <SEO
        title="Log In"
        description="Log in to your DraftEngine account. Access your source library, outlines, and generated content."
        path="/login"
        noIndex={true}
      />
      {/* Left Panel - Brand/Hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">DraftEngine</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              From Sources to Finished Drafts in Minutes
            </h2>

            <p className="text-white/70 text-lg mb-8 max-w-md">
              Let AI analyze your research papers and generate comprehensive source entries automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src="/images/auth_illustration.png"
              alt="AI Writing Assistant"
              className="w-full rounded-2xl object-cover"
              style={{ aspectRatio: '4/3' }}
              loading="eager"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-2 text-white/70">
              <Users className="w-4 h-4" />
              <span className="text-sm">10,000+ writers</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Mobile Header (visible only on mobile) */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <ScaleIn>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-secondary-700">
                Sign in to your DraftEngine account
              </p>
            </div>

            {/* Login Form */}
            <div className="glass-card p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="form-input pl-10"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="form-input pl-10 pr-10"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary-400" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Forgot Password Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex justify-end"
                >
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-secondary-600">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <motion.button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-secondary-300/30 rounded-lg bg-white hover:bg-secondary-50 transition-colors font-medium text-secondary-900"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-secondary-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary-700">
                  Sign up for free
                </Link>
              </p>
            </div>
          </ScaleIn>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
