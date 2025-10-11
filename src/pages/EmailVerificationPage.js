import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerificationToUser, isEmailVerified } from '../services/auth';
import toast from 'react-hot-toast';

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email is already verified
    if (currentUser && currentUser.emailVerified) {
      setIsVerified(true);
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [currentUser, navigate]);

  // Check verification status
  const checkVerificationStatus = async () => {
    if (!currentUser) return;
    
    try {
      // Reload the user to get the latest verification status
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        setIsVerified(true);
        toast.success('Email verified successfully!');
        
        // Refresh the auth context
        if (refreshUser) {
          await refreshUser();
        }
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        toast.error('Email not yet verified. Please check your inbox.');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      toast.error('Failed to check verification status');
    }
  };

  const resendVerificationEmail = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      await sendEmailVerificationToUser();
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      
      if (error.message.includes('already verified')) {
        toast.success('Email is already verified!');
        setIsVerified(true);
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a few minutes before trying again.');
      } else {
        toast.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-pearl flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="card">
            <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-2">
              Please Sign In
            </h2>
            <p className="text-secondary-700 font-lato mb-6">
              You need to be signed in to verify your email.
            </p>
            <Link to="/login" className="btn btn-primary w-full">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {!isVerified ? (
          /* Verification Required */
          <div className="card text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-2">
              Verify Your Email
            </h2>
            
            <p className="text-secondary-700 font-lato mb-6">
              We've sent a verification email to{' '}
              <strong className="text-secondary-900">{currentUser.email}</strong>.
              Please check your inbox and click the verification link to continue.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={checkVerificationStatus}
                className="btn btn-primary w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                I've Verified My Email
              </button>
              
              <button
                onClick={resendVerificationEmail}
                disabled={isLoading}
                className="btn btn-outline w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-secondary-300/20">
              <p className="text-sm text-secondary-600 font-lato mb-4">
                Can't find the email? Check your spam folder or make sure you entered the correct email address.
              </p>
              
              <Link
                to="/profile"
                className="text-accent hover:text-accent-600/80 text-sm font-medium"
              >
                Update Email Address
              </Link>
            </div>
          </div>
        ) : (
          /* Verification Success */
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-2">
              Email Verified!
            </h2>
            
            <p className="text-secondary-700 font-lato mb-6">
              Your email has been successfully verified. You'll be redirected to your dashboard shortly.
            </p>
            
            <Link to="/dashboard" className="btn btn-primary w-full">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;