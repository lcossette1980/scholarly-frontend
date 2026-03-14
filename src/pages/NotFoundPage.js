// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain } from 'lucide-react';
import { FadeIn, ScaleIn } from '../components/motion';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-mesh relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="gradient-orb w-72 h-72 top-10 -left-20" />
      <div className="gradient-orb w-96 h-96 bottom-10 -right-20" />
      <div className="gradient-orb w-64 h-64 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-lg mx-auto text-center relative z-10">
        <ScaleIn>
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-brand rounded-2xl flex items-center justify-center animate-float">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </ScaleIn>

        <FadeIn delay={0.2}>
          <h1 className="text-6xl font-bold text-secondary-900 mb-4">404</h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Page Not Found
          </h2>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="text-secondary-700 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link to="/" className="btn btn-primary shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-shadow">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </motion.div>
            <div className="text-sm text-secondary-600">
              Need help? <Link to="/help" className="text-accent hover:text-accent-600/80">Contact support</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default NotFoundPage;
