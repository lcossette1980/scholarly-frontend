// src/pages/EmailVerificationPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowRight, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerificationToUser } from '../services/auth';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      setIsVerified(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [currentUser, navigate]);

  const checkVerificationStatus = async () => {
    if (!currentUser) return;
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        setIsVerified(true);
        toast.success('Email verified successfully!');
        if (refreshUser) await refreshUser();
        setTimeout(() => navigate('/dashboard'), 1500);
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
      if (error.message?.includes('already verified')) {
        toast.success('Email is already verified!');
        setIsVerified(true);
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a few minutes.');
      } else {
        toast.error('Failed to send verification email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <SEO title="Verify your email" noIndex={true} />
        <div className="w-full max-w-sm text-center">
          <div className="w-10 h-10 rounded-full bg-warning-50 border border-warning-200 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-5 h-5 text-warning-700" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-2">Please sign in</h2>
          <p className="text-sm text-secondary-600 mb-6">
            You need to be signed in to verify your email.
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to sign in
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <SEO title="Verify your email" noIndex={true} />
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-10 justify-center w-full">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-secondary-900 tracking-tight">DraftEngine</span>
        </Link>

        {!isVerified ? (
          <div className="rounded-lg border border-secondary-200 bg-white p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary-100 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-5 h-5 text-primary" />
            </div>

            <h1 className="text-xl font-semibold text-secondary-900 tracking-tight mb-2">
              Verify your email
            </h1>
            <p className="text-sm text-secondary-600 mb-6 leading-relaxed">
              We've sent a verification link to{' '}
              <strong className="text-secondary-900">{currentUser.email}</strong>.
              Check your inbox to continue.
            </p>

            <div className="space-y-2">
              <button onClick={checkVerificationStatus} className="btn btn-primary w-full">
                <CheckCircle className="w-3.5 h-3.5" />
                I've verified my email
              </button>
              <button
                onClick={resendVerificationEmail}
                disabled={isLoading}
                className="btn btn-secondary w-full"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Sending…' : 'Resend verification email'}
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-secondary-200">
              <p className="text-xs text-secondary-500 mb-3 leading-relaxed">
                Can't find it? Check your spam folder or update your email.
              </p>
              <Link to="/profile" className="text-xs text-secondary-700 hover:text-secondary-900 font-medium transition-colors">
                Update email address
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-secondary-200 bg-white p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-success-50 border border-success-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-5 h-5 text-success-600" />
            </div>
            <h1 className="text-xl font-semibold text-secondary-900 tracking-tight mb-2">
              Email verified!
            </h1>
            <p className="text-sm text-secondary-600 mb-6">
              You'll be redirected to your dashboard shortly.
            </p>
            <Link to="/dashboard" className="btn btn-primary w-full">
              Go to dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
