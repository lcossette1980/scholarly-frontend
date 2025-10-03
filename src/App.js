// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { initErrorMonitoring } from './services/errorMonitoring';
import { validateEnvironment } from './config/environment';

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
import FeaturesPage from './pages/FeaturesPage';
import DocumentationPage from './pages/DocumentationPage';
import DocsPage from './pages/DocsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsofServicePage from './pages/TermsofServicePage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-brand">
            <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsofServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateEntryPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/bibliography" element={
                <ProtectedRoute>
                  <BibliographyPage />
                </ProtectedRoute>
              } />
              <Route path="/analyze" element={
                <ProtectedRoute>
                  <AnalyzePage />
                </ProtectedRoute>
              } />

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#2A2A2A',
                border: '1px solid #A59E8C',
              },
              success: {
                iconTheme: {
                  primary: '#A44A3F',
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
  );
}

export default App;