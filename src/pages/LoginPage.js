// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, PenTool, ArrowRight } from 'lucide-react';
import { signIn, signInWithGoogle } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  React.useEffect(() => {
    if (currentUser) {
      const isGoogleRedirect = window.location.search.includes('code=') ||
        window.location.search.includes('state=') ||
        document.referrer.includes('accounts.google.com');
      if (!isGoogleRedirect) navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
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
      const { user, error } = await signInWithGoogle();
      if (error) {
        toast.error(error);
        setIsLoading(false);
      } else if (user) {
        toast.success('Welcome!');
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <SEO title="Log In" description="Log in to your DraftEngine account." path="/login" noIndex={true} />

      {/* Left panel — quiet brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-900 relative overflow-hidden flex-col justify-between p-12">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">DraftEngine</span>
        </Link>

        <div className="max-w-md">
          <blockquote className="text-2xl font-medium text-white leading-snug tracking-tight">
            "Cut my white-paper production from two weeks to two hours. The citations alone saved me twenty hours of formatting."
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary-700 flex items-center justify-center text-sm font-medium text-white">M</div>
            <div>
              <p className="text-sm font-medium text-white">Marketing lead at a Fortune 500</p>
              <p className="text-xs text-secondary-400">DraftEngine customer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary-400">
          <span>10,000+ writers</span>
          <span className="w-1 h-1 rounded-full bg-secondary-700" />
          <span>Secure & private</span>
          <span className="w-1 h-1 rounded-full bg-secondary-700" />
          <span>No credit card</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
              </div>
              <span className="text-base font-semibold text-secondary-900 tracking-tight">DraftEngine</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-secondary-900 tracking-tight">Welcome back</h1>
            <p className="mt-1.5 text-sm text-secondary-600">Sign in to your DraftEngine account</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-secondary-200 rounded-md bg-white hover:bg-secondary-50 transition-colors font-medium text-sm text-secondary-900 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-secondary-500 uppercase tracking-wider">or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="form-input pl-9"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label htmlFor="password" className="form-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input pl-9 pr-9"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-secondary-900 hover:text-primary transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
