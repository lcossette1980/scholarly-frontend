// src/pages/PrivacyPolicyPage.js
import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-chestnut rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-charcoal font-playfair mb-4">
            Privacy Policy
          </h1>
          <p className="text-charcoal/70 font-lato">
            Last updated: December 2024
          </p>
        </div>

        <div className="card space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <UserCheck className="w-5 h-5 text-chestnut mt-1" />
                <div>
                  <h3 className="font-semibold text-charcoal font-lato">Account Information</h3>
                  <p className="text-charcoal/70 font-lato">Name, email address, and authentication data when you create an account.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Database className="w-5 h-5 text-chestnut mt-1" />
                <div>
                  <h3 className="font-semibold text-charcoal font-lato">Usage Data</h3>
                  <p className="text-charcoal/70 font-lato">Information about how you use our service, including bibliography entries created and research focus areas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-chestnut mt-1" />
                <div>
                  <h3 className="font-semibold text-charcoal font-lato">Document Content</h3>
                  <p className="text-charcoal/70 font-lato">PDF documents you upload for analysis (processed securely and not stored permanently).</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              How We Use Your Information
            </h2>
            <ul className="space-y-2 text-charcoal/80 font-lato">
              <li>• Provide and improve our bibliography generation service</li>
              <li>• Process your academic documents using AI technology</li>
              <li>• Manage your account and subscription</li>
              <li>• Send important service updates and support communications</li>
              <li>• Analyze usage patterns to improve our AI models</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Data Security
            </h2>
            <div className="bg-chestnut/5 border border-chestnut/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Lock className="w-6 h-6 text-chestnut" />
                <h3 className="font-semibold text-charcoal font-lato">Enterprise-Grade Security</h3>
              </div>
              <p className="text-charcoal/80 font-lato">
                We use industry-standard encryption, secure cloud infrastructure (Firebase/Google Cloud), 
                and follow best practices to protect your data. Documents are processed securely and 
                temporarily - we don't permanently store your uploaded PDFs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Third-Party Services
            </h2>
            <p className="text-charcoal/80 font-lato mb-4">
              We use trusted third-party services to provide our functionality:
            </p>
            <ul className="space-y-2 text-charcoal/80 font-lato">
              <li>• <strong>OpenAI:</strong> For AI-powered text analysis and generation</li>
              <li>• <strong>Firebase/Google Cloud:</strong> For authentication and data storage</li>
              <li>• <strong>Stripe:</strong> For secure payment processing</li>
              <li>• <strong>Vercel:</strong> For application hosting and performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Your Rights
            </h2>
            <p className="text-charcoal/80 font-lato mb-4">
              You have the right to access, update, or delete your personal information. 
              You can also export your data or request account deletion at any time.
            </p>
          </section>

          <section>
            <div className="bg-bone border border-khaki/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="w-6 h-6 text-chestnut" />
                <h3 className="font-semibold text-charcoal font-lato">Contact Us</h3>
              </div>
              <p className="text-charcoal/80 font-lato">
                For privacy questions or to exercise your rights, contact us at{' '}
                <a href="mailto:privacy@scholarlyaiapp.com" className="text-chestnut hover:text-chestnut/80">
                  privacy@scholarlyaiapp.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;