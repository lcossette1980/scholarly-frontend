// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Mail, Github, Linkedin, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-secondary-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" strokeWidth={2.25} />
              </div>
              <span className="text-[15px] font-semibold text-secondary-900 tracking-tight">DraftEngine</span>
            </Link>
            <p className="text-sm text-secondary-600 max-w-xs leading-relaxed">
              Research-to-content for professionals. Import, generate, publish — with citations and quality review.
            </p>

            <div className="mt-6 flex items-center gap-1">
              <a
                href="https://github.com/lcossette1980/scholarlyai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/loren-cossette/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61575751506158"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@draftengineapp.com"
                className="p-2 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-md transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link to="/features" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Pricing</Link></li>
              <li><Link to="/docs" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">How it works</Link></li>
              <li><Link to="/feeds" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Research Feeds</Link></li>
            </ul>
          </div>

          {/* Use cases */}
          <div>
            <h4 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-4">Built for</h4>
            <ul className="space-y-2.5">
              <li><Link to="/for/marketing-teams" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Marketing teams</Link></li>
              <li><Link to="/for/consultants" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Consultants</Link></li>
              <li><Link to="/for/startups" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Startups</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold text-secondary-900 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li><Link to="/help" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Help center</Link></li>
              <li><Link to="/ethical-ai" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Responsible AI</Link></li>
              <li><a href="mailto:support@draftengineapp.com" className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-secondary-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xs text-secondary-500">
            &copy; 2026 DraftEngine. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">Terms</Link>
            <Link to="/cookies" className="text-xs text-secondary-500 hover:text-secondary-900 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
