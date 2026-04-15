// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Mail, Facebook, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from './motion';

const Footer = () => {
  return (
    <footer className="bg-primary-700 text-white mt-16">
      {/* Decorative accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />

      <div className="container mx-auto px-6 py-12">
        <FadeIn direction="up">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">DraftEngine</h3>
                  <p className="text-xs text-white/70">Research-to-Content Platform</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">
                Turn research into publication-ready content. Source analysis, document generation, citations, and illustrations — built for professionals who publish.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <motion.a
                  href="https://www.facebook.com/profile.php?id=61575751506158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://github.com/lcossette1980/scholarlyai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/loren-cossette/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-white/70 text-sm">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/create" className="hover:text-white transition-colors">Create Entry</Link></li>
                <li><Link to="/sources" className="hover:text-white transition-colors">Source Library</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3 text-white/70 text-sm">
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/ethical-ai" className="hover:text-white transition-colors">Ethical AI Use</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-3 text-white/70 text-sm">
                <li>
                  <a href="mailto:support@draftengine.co" className="hover:text-white transition-colors flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Support</span>
                  </a>
                </li>
                <li>
                  <p>Monday - Friday: 9 AM - 6 PM EST</p>
                </li>
                <li>
                  <p>Response time: Within 24 hours</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              &copy; 2024 DraftEngine. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-white/70 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-white/70 hover:text-white text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default Footer;
