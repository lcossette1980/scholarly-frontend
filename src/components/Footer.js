// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, Facebook, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-chestnut rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-playfair">ScholarlyAI</h3>
                <p className="text-xs text-white/70">AI Research Assistant</p>
              </div>
            </div>
            <p className="text-white/70 font-lato leading-relaxed">
              Your complete AI research platform. From PDFs to published papers in hours, not weeks.
              Trusted by 10,000+ researchers worldwide.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61575751506158" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/lcossette1980/scholarlyai" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/loren-cossette/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold font-playfair mb-4">Product</h4>
            <ul className="space-y-3 text-white/70 font-lato">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/create" className="hover:text-white transition-colors">Create Entry</Link></li>
              <li><Link to="/bibliography" className="hover:text-white transition-colors">Manage Bibliography</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold font-playfair mb-4">Resources</h4>
            <ul className="space-y-3 text-white/70 font-lato">
              <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold font-playfair mb-4">Support</h4>
            <ul className="space-y-3 text-white/70 font-lato">
              <li>
                <a href="mailto:support@scholarlyaiapp.com" className="hover:text-white transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
              </li>
              <li className="text-sm">
                <p>Monday - Friday: 9 AM - 6 PM EST</p>
              </li>
              <li className="text-sm">
                <p>Response time: Within 24 hours</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 font-lato text-sm">
            © 2024 ScholarlyAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-white/70 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;