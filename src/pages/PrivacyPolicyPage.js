// src/pages/PrivacyPolicyPage.js
import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';
import { FadeIn } from '../components/motion';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen py-12 bg-mesh">
      <SEO
        title="Privacy Policy"
        description="DraftEngine privacy policy. How we collect, use, and protect your data."
        path="/privacy"
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="h-1 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400" />
        <FadeIn direction="up">
          <div className="text-center mb-12 mt-8">
            <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              <span className="text-gradient">Privacy</span> Policy
            </h1>
            <p className="text-secondary-700">
              Last updated: December 2024
            </p>
          </div>

          <div className="card card-floating space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Information We <span className="text-gradient">Collect</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <UserCheck className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Account Information</h3>
                    <p className="text-secondary-700">Name, email address, and authentication data when you create an account.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Usage Data</h3>
                    <p className="text-secondary-700">Information about how you use our service, including bibliography entries created and research focus areas.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold text-secondary-900">Document Content</h3>
                    <p className="text-secondary-700">PDF documents you upload for analysis (processed securely and not stored permanently).</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-secondary-800">
                <li>• Provide and improve our bibliography generation service</li>
                <li>• Process your documents using AI technology</li>
                <li>• Manage your account and subscription</li>
                <li>• Send important service updates and support communications</li>
                <li>• Analyze usage patterns to improve our AI models</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Data <span className="text-gradient">Security</span>
              </h2>
              <div className="bg-accent/5 border border-accent-600/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Lock className="w-6 h-6 text-accent" />
                  <h3 className="font-semibold text-secondary-900">Enterprise-Grade Security</h3>
                </div>
                <p className="text-secondary-800">
                  We use industry-standard encryption, secure cloud infrastructure (Firebase/Google Cloud),
                  and follow best practices to protect your data. Documents are processed securely and
                  temporarily - we don't permanently store your uploaded PDFs.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-secondary-800 mb-4">
                We use trusted third-party services to provide our functionality:
              </p>
              <ul className="space-y-2 text-secondary-800">
                <li>• <strong>OpenAI:</strong> For AI-powered text analysis and generation</li>
                <li>• <strong>Firebase/Google Cloud:</strong> For authentication and data storage</li>
                <li>• <strong>Stripe:</strong> For secure payment processing</li>
                <li>• <strong>Vercel:</strong> For application hosting and performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                Your Rights
              </h2>
              <p className="text-secondary-800 mb-4">
                You have the right to access, update, or delete your personal information.
                You can also export your data or request account deletion at any time.
              </p>
            </section>

            <section>
              <div className="bg-secondary-50 border border-secondary-300/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-accent" />
                  <h3 className="font-semibold text-secondary-900">Contact Us</h3>
                </div>
                <p className="text-secondary-800">
                  For privacy questions or to exercise your rights, contact us at{' '}
                  <a href="mailto:privacy@scholarlyaiapp.com" className="text-accent hover:text-accent-600/80">
                    privacy@scholarlyaiapp.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
