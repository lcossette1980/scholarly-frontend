// src/pages/TermsOfServicePage.js
import React from 'react';
import { FileText, AlertTriangle, CreditCard, Users, Gavel } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-6">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 font-playfair mb-4">
            Terms of Service
          </h1>
          <p className="text-secondary-700 font-lato">
            Last updated: December 2024
          </p>
        </div>

        <div className="card space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-secondary-800 font-lato">
              By accessing and using ScholarlyAI, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              Service Description
            </h2>
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="text-secondary-800 font-lato">
                  ScholarlyAI provides AI-powered annotated bibliography generation services for academic research. 
                  Our service analyzes uploaded PDF documents and generates comprehensive bibliography entries 
                  with citations, summaries, and key insights.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              User Responsibilities
            </h2>
            <ul className="space-y-3 text-secondary-800 font-lato">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                <span>Upload only documents you have the right to use and analyze</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                <span>Use generated content for legitimate academic and research purposes</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                <span>Review and verify all AI-generated content before use</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                <span>Comply with your institution's academic integrity policies</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              Subscription and Billing
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-secondary-900 font-lato">Payment Terms</h3>
                  <p className="text-secondary-700 font-lato">
                    Subscriptions are billed monthly and automatically renew. You can cancel anytime 
                    through your account settings or contact support.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-accent mt-1" />
                <div>
                  <h3 className="font-semibold text-secondary-900 font-lato">Usage Limits</h3>
                  <p className="text-secondary-700 font-lato">
                    Each plan includes a monthly limit on bibliography entries. Unused entries do not roll over.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-800 font-lato mb-2">Important Disclaimer</h3>
                  <p className="text-yellow-700 font-lato">
                    AI-generated content should be reviewed and verified before use. ScholarlyAI is a tool 
                    to assist with research - users are responsible for ensuring accuracy and compliance 
                    with academic standards.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              Limitation of Liability
            </h2>
            <p className="text-secondary-800 font-lato">
              ScholarlyAI provides the service "as is" and makes no warranties about accuracy, 
              completeness, or reliability of AI-generated content. We are not liable for any 
              academic, professional, or financial consequences of using our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
              Contact Information
            </h2>
            <p className="text-secondary-800 font-lato">
              For questions about these terms, please contact us at{' '}
              <a href="mailto:legal@scholarlyaiapp.com" className="text-accent hover:text-accent-600/80">
                legal@scholarlyaiapp.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;