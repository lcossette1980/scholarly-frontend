// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-chestnut rounded-2xl flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-charcoal font-playfair mb-4">404</h1>
        <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
          Page Not Found
        </h2>
        <p className="text-charcoal/70 font-lato mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link to="/" className="btn btn-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div className="text-sm text-charcoal/60 font-lato">
            Need help? <Link to="/contact" className="text-chestnut hover:text-chestnut/80">Contact support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;