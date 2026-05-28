// src/pages/PrivacyPolicyPage.js
import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Privacy Policy"
        description="DraftEngine privacy policy. How we collect, use, and protect your data."
        path="/privacy"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-20">
        <div className="mb-12">
          <div className="eyebrow mb-3">Legal</div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-secondary-500">Last updated: December 2024</p>
        </div>

        <div className="prose prose-secondary max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Information we collect
            </h2>
            <div className="space-y-4 text-sm text-secondary-700 leading-relaxed">
              <p>
                <strong className="text-secondary-900">Account information.</strong> Name, email address, and authentication data when you create an account.
              </p>
              <p>
                <strong className="text-secondary-900">Usage data.</strong> Information about how you use our service, including source entries created and writing focus areas.
              </p>
              <p>
                <strong className="text-secondary-900">Document content.</strong> PDFs and other source material you upload for analysis. Processed securely and not stored permanently.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              How we use your information
            </h2>
            <ul className="space-y-2 text-sm text-secondary-700 leading-relaxed list-disc pl-5">
              <li>Provide and improve our source analysis and generation services</li>
              <li>Process your documents using AI technology</li>
              <li>Manage your account and subscription</li>
              <li>Send important service updates and support communications</li>
              <li>Analyze aggregated usage patterns to improve our models</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Data security
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              We use industry-standard encryption, secure cloud infrastructure (Firebase / Google Cloud), and follow best practices to protect your data. Documents are processed securely and temporarily — we don't permanently store your uploaded PDFs.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Third-party services
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed mb-3">
              We use trusted third-party services to provide our functionality:
            </p>
            <ul className="space-y-1.5 text-sm text-secondary-700 leading-relaxed list-disc pl-5">
              <li><strong className="text-secondary-900">Anthropic & OpenAI</strong> — AI-powered analysis and generation</li>
              <li><strong className="text-secondary-900">Firebase / Google Cloud</strong> — Authentication and storage</li>
              <li><strong className="text-secondary-900">Stripe</strong> — Secure payment processing</li>
              <li><strong className="text-secondary-900">Vercel & Render</strong> — Application hosting</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Your rights
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              You have the right to access, update, or delete your personal information. You can also export your data or request account deletion at any time.
            </p>
          </section>

          <div className="mt-12 rounded-lg border border-secondary-200 bg-secondary-50/40 p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">Contact us</h3>
            <p className="text-sm text-secondary-700">
              For privacy questions or to exercise your rights, email{' '}
              <a href="mailto:privacy@draftengineapp.com" className="text-primary hover:text-secondary-900 underline transition-colors">
                privacy@draftengineapp.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
