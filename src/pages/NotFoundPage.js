// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <SEO title="Page not found" description="The page you're looking for doesn't exist." noIndex={true} />
      <div className="max-w-md text-center">
        <p className="text-7xl font-semibold text-secondary-200 tracking-tight tabular-nums mb-2">404</p>
        <h1 className="text-2xl font-semibold text-secondary-900 tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-secondary-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
          <p className="text-xs text-secondary-500">
            Need help? <Link to="/help" className="text-secondary-900 hover:text-primary transition-colors font-medium">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
