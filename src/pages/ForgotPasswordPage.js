import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { resetPassword } from '../services/auth';
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
    <div className="min-h-screen bg-pearl flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <Link 
            to="/login" 
            className="flex items-center text-secondary-700 hover:text-secondary-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 font-playfair">
              Reset Your Password
            </h2>
            <p className="mt-2 text-secondary-700 font-lato">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>
        </div>

        {!emailSent ? (
          /* Reset Form */
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="card">
              <div className="space-y-4">
                <div>
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
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-secondary-900 font-playfair mb-2">
              Email Sent Successfully
            </h3>
            
            <p className="text-secondary-700 font-lato mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="btn btn-outline w-full"
              >
                Send Another Email
              </button>
              
              <Link to="/login" className="btn btn-primary w-full">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-secondary-600 font-lato">
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
      </div>
    </div>
  );
};

export default ForgotPasswordPage;