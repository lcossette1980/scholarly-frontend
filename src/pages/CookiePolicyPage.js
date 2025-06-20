// src/pages/CookiePolicyPage.js
import React from 'react';
import { Cookie, Settings, BarChart3, Shield } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-chestnut rounded-full flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-charcoal font-playfair mb-4">
            Cookie Policy
          </h1>
          <p className="text-charcoal/70 font-lato">
            Last updated: December 2024
          </p>
        </div>

        <div className="card space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              What Are Cookies?
            </h2>
            <p className="text-charcoal/80 font-lato">
              Cookies are small data files stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences 
              and improving our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-chestnut" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal font-lato mb-2">Essential Cookies</h3>
                  <p className="text-charcoal/70 font-lato">
                    Required for the website to function properly. These include authentication, 
                    security, and basic functionality cookies.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-chestnut" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal font-lato mb-2">Functional Cookies</h3>
                  <p className="text-charcoal/70 font-lato">
                    Remember your preferences, such as research focus areas and settings, 
                    to provide a personalized experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-chestnut" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal font-lato mb-2">Analytics Cookies</h3>
                  <p className="text-charcoal/70 font-lato">
                    Help us understand how you use our service so we can improve performance 
                    and user experience. These are anonymized and aggregated.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-charcoal/80 font-lato mb-4">
              We use some third-party services that may set their own cookies:
            </p>
            <ul className="space-y-2 text-charcoal/80 font-lato">
              <li>• <strong>Google Analytics:</strong> Website usage analytics</li>
              <li>• <strong>Stripe:</strong> Payment processing and fraud prevention</li>
              <li>• <strong>Firebase:</strong> Authentication and application functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Managing Your Cookie Preferences
            </h2>
            <div className="bg-bone border border-khaki/30 rounded-lg p-6">
              <p className="text-charcoal/80 font-lato mb-4">
                You can control cookies through your browser settings. However, disabling certain 
                cookies may affect the functionality of our service.
              </p>
              <div className="space-y-2 text-sm text-charcoal/70 font-lato">
                <p><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</p>
                <p><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</p>
                <p><strong>Safari:</strong> Preferences → Privacy → Cookies</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-4">
              Updates to This Policy
            </h2>
            <p className="text-charcoal/80 font-lato">
              We may update this Cookie Policy periodically. Changes will be posted on this page 
              with an updated revision date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;