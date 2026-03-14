// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FadeIn } from '../components/motion';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-mesh relative overflow-hidden">
      <div className="max-w-lg mx-auto text-center relative z-10 mt-20">
        <FadeIn>
          <p className="text-8xl font-bold text-secondary-200 mb-2">404</p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            Page Not Found
          </h1>
        </FadeIn>
        <FadeIn delay={0.25}>
          <p className="text-secondary-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link to="/" className="btn btn-primary">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </motion.div>
            <div className="text-sm text-secondary-500">
              Need help? <Link to="/help" className="text-accent hover:text-accent-600/80">Contact support</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default NotFoundPage;
