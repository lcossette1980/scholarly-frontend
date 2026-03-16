// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { initErrorMonitoring } from './services/errorMonitoring';
import { validateEnvironment } from './config/environment';
import { PageTransition } from './components/motion';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import DashboardPage from './pages/DashboardPage';
import PricingPage from './pages/PricingPage';
import ProfilePage from './pages/ProfilePage';
import CreateEntryPage from './pages/CreateEntryPage';
import BibliographyPage from './pages/BibliographyPage';
import AnalyzePage from './pages/AnalyzePage';
import OutlineViewPage from './pages/OutlineViewPage';
import ContentGenerationPage from './pages/ContentGenerationPage';
import ContentHistoryPage from './pages/ContentHistoryPage';
import ContentViewPage from './pages/ContentViewPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import DocsPage from './pages/DocsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsofServicePage from './pages/TermsofServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AcademicIntegrityPage from './pages/AcademicIntegrityPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Validate environment variables
try {
  const validation = validateEnvironment();
  if (!validation.isValid) {
    console.error('⚠️ App starting with environment issues. Check console for details.');
  }
} catch (error) {
  console.error('❌ Critical environment validation failed:', error.message);
}

// Initialize error monitoring
initErrorMonitoring();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><EmailVerificationPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/docs" element={<PageTransition><DocsPage /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenterPage /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsofServicePage /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><CookiePolicyPage /></PageTransition>} />
        <Route path="/ethical-ai" element={<PageTransition><AcademicIntegrityPage /></PageTransition>} />
        <Route path="/academic-integrity" element={<Navigate to="/ethical-ai" replace />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageTransition><DashboardPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/create" element={
          <ProtectedRoute>
            <PageTransition><CreateEntryPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><ProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/bibliography" element={
          <ProtectedRoute>
            <PageTransition><BibliographyPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/analyze" element={
          <ProtectedRoute>
            <PageTransition><AnalyzePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/analyze/outline" element={
          <ProtectedRoute>
            <PageTransition><OutlineViewPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/content/generate" element={
          <ProtectedRoute>
            <PageTransition><ContentGenerationPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/content/history" element={
          <ProtectedRoute>
            <PageTransition><ContentHistoryPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/content/view/:jobId" element={
          <ProtectedRoute>
            <PageTransition><ContentViewPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <PageTransition><AdminDashboardPage /></PageTransition>
          </ProtectedRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <ScrollToTop />
            <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
