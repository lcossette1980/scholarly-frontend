// src/pages/CookiePolicyPage.js
import React from 'react';
import SEO from '../components/SEO';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Cookie Policy"
        description="DraftEngine cookie policy. How we use cookies and similar technologies."
        path="/cookies"
      />

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-20">
        <div className="mb-12">
          <div className="eyebrow mb-3">Legal</div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-secondary-900 tracking-tight">
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-secondary-500">Last updated: December 2024</p>
        </div>

        <div className="prose prose-secondary max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              What are cookies?
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              Cookies are small data files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and improving our service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Types of cookies we use
            </h2>
            <div className="space-y-4 text-sm text-secondary-700 leading-relaxed">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Essential cookies</h3>
                <p>Required for the website to function — authentication, security, and basic functionality.</p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Functional cookies</h3>
                <p>Remember your preferences (research focus areas, settings) to provide a personalized experience.</p>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">Analytics cookies</h3>
                <p>Help us understand how you use our service so we can improve performance. Anonymized and aggregated.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Third-party cookies
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed mb-3">
              Some third-party services we use may set their own cookies:
            </p>
            <ul className="space-y-1.5 text-sm text-secondary-700 leading-relaxed list-disc pl-5">
              <li><strong className="text-secondary-900">Google Analytics</strong> — Website usage analytics</li>
              <li><strong className="text-secondary-900">Stripe</strong> — Payment processing and fraud prevention</li>
              <li><strong className="text-secondary-900">Firebase</strong> — Authentication and application functionality</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Managing your preferences
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed mb-3">
              You can control cookies through your browser settings. Disabling certain cookies may affect functionality.
            </p>
            <div className="rounded-lg border border-secondary-200 bg-secondary-50/40 p-4 space-y-1.5 text-sm text-secondary-700">
              <p><strong className="text-secondary-900">Chrome:</strong> Settings → Privacy and Security → Cookies</p>
              <p><strong className="text-secondary-900">Firefox:</strong> Preferences → Privacy & Security → Cookies</p>
              <p><strong className="text-secondary-900">Safari:</strong> Preferences → Privacy → Cookies</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-secondary-900 tracking-tight mb-3">
              Updates to this policy
            </h2>
            <p className="text-sm text-secondary-700 leading-relaxed">
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
