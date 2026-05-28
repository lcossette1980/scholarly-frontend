// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, PenTool, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen flex bg-white">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary-900 relative overflow-hidden flex-col justify-between p-12">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">DraftEngine</span>
        </Link>

        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-white tracking-tight leading-tight">
            Let's get you back in.
          </h2>
          <p className="mt-4 text-secondary-300 leading-relaxed">
            We'll send a secure password reset link to your email. The link expires in 1 hour.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary-400">
          <span>Secure & private</span>
          <span className="w-1 h-1 rounded-full bg-secondary-700" />
          <span>Encrypted reset</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-secondary-500 hover:text-secondary-900 mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-secondary-900 tracking-tight">Reset password</h1>
            <p className="mt-1.5 text-sm text-secondary-600">
              Enter your email and we'll send a reset link.
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input pl-9"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send reset email
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="rounded-lg border border-secondary-200 bg-white p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-success-50 border border-success-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
              <h3 className="text-base font-semibold text-secondary-900 mb-1">Email sent</h3>
              <p className="text-sm text-secondary-600 mb-5 leading-relaxed">
                A reset link was sent to <strong className="text-secondary-900">{email}</strong>. Check your inbox.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/login" className="btn btn-primary w-full">Back to sign in</Link>
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="btn btn-ghost w-full"
                >
                  Send another email
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-secondary-500">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
