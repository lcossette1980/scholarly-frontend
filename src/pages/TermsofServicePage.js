// src/pages/TermsofServicePage.js
import React from 'react';
import SEO from '../components/SEO';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Terms of Service"
        description="DraftEngine terms of service. Usage rules, intellectual property, and legal terms."
        path="/terms"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-20">
        <div className="mb-12">
          <div className="eyebrow mb-3">Legal</div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-secondary-500">Last updated: December 2024</p>
        </div>

        <div className="prose prose-secondary max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Acceptance of terms
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              By accessing and using DraftEngine, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Service description
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              DraftEngine provides AI-powered source analysis and document generation services. Our service analyzes uploaded source material and generates comprehensive source entries with key arguments, interesting angles, and notable passages — and produces complete documents with citations.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              User responsibilities
            </h2>
            <ul className="space-y-2 text-sm text-secondary-700 leading-relaxed list-disc pl-5">
              <li>Upload only documents you have the right to use and analyze</li>
              <li>Use generated content for legitimate research and writing purposes</li>
              <li>Review and verify all AI-generated content before use</li>
              <li>Comply with your institution's integrity policies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Subscription and billing
            </h2>
            <div className="space-y-4 text-sm text-secondary-700 leading-relaxed">
              <p>
                <strong className="text-secondary-900">Payment terms.</strong> Subscriptions are billed monthly and automatically renew. You can cancel anytime through your account settings or by contacting support.
              </p>
              <p>
                <strong className="text-secondary-900">Usage limits.</strong> Each plan includes specific limits on source entries and pages. Pro plans include 10 pages monthly. Unused entries do not roll over.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-5">
              <h3 className="text-sm font-semibold text-warning-800 mb-2">Important disclaimer</h3>
              <p className="text-sm text-warning-800 leading-relaxed">
                AI-generated content should be reviewed and verified before use. DraftEngine is a tool to assist with writing — users are responsible for ensuring accuracy and compliance with applicable standards.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Limitation of liability
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              DraftEngine provides the service "as is" and makes no warranties about accuracy, completeness, or reliability of AI-generated content. We are not liable for any professional or financial consequences of using our service.
            </p>
          </section>

          <div className="mt-12 rounded-lg border border-secondary-200 bg-secondary-50/40 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">Contact us</h3>
            <p className="text-sm text-secondary-700">
              For questions about these terms, email{' '}
              <a href="mailto:legal@draftengineapp.com" className="text-primary hover:text-secondary-900 underline transition-colors">
                legal@draftengineapp.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
