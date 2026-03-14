import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, Brain, Shield, Users } from 'lucide-react';
import { resetPassword } from '../services/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ScaleIn } from '../components/motion';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);

      // Handle specific Firebase errors
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand/Hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="gradient-orb w-64 h-64 top-10 -left-20 bg-white/10" />
        <div className="gradient-orb w-48 h-48 bottom-20 right-10 bg-white/5" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">DraftEngine</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 leading-tight">
              From Sources to Finished Drafts in Minutes
            </h2>

            <p className="text-white/70 text-lg mb-8 max-w-md">
              Don't worry, we'll help you get back into your account quickly and securely.
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

      {/* Right Panel - Reset Form */}
      <div className="w-full lg:w-1/2 bg-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <ScaleIn>
            {/* Back Link */}
            <Link
              to="/login"
              className="flex items-center text-secondary-700 hover:text-secondary-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary-900">
                Reset Your Password
              </h2>
              <p className="mt-2 text-secondary-700">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!emailSent ? (
                /* Reset Form */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="glass-card p-8 rounded-2xl">
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          <label htmlFor="email" className="form-label">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="form-input pl-10"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={isLoading}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {isLoading ? 'Sending...' : 'Send Reset Email'}
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </form>
                </motion.div>
              ) : (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass-card p-8 rounded-2xl text-center">
                    <ScaleIn>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </ScaleIn>

                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      Email Sent Successfully
                    </h3>

                    <p className="text-secondary-700 mb-6">
                      We've sent a password reset link to <strong>{email}</strong>.
                      Please check your inbox and follow the instructions to reset your password.
                    </p>

                    <div className="space-y-4">
                      <motion.button
                        onClick={() => {
                          setEmailSent(false);
                          setEmail('');
                        }}
                        className="btn btn-outline w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Send Another Email
                      </motion.button>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link to="/login" className="btn btn-primary w-full inline-block text-center">
                          Back to Login
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-sm text-secondary-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="text-accent hover:text-accent-600/80 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </ScaleIn>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
