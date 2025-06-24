// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Brain } from 'lucide-react';
import { signIn, signInWithGoogle } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-chestnut rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-charcoal font-playfair mb-2">
            Welcome Back
          </h1>
          <p className="text-charcoal/70 font-lato">
            Sign in to your ScholarlyAI account
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-charcoal/40" />
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
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-charcoal/40" />
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
                    <EyeOff className="h-5 w-5 text-charcoal/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-charcoal/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-chestnut hover:text-chestnut/80 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-khaki/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-charcoal/60">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-khaki/30 rounded-lg bg-white hover:bg-bone transition-colors font-medium text-charcoal"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-charcoal/60">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-chestnut hover:text-chestnut/80">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;