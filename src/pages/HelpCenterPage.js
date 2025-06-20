// src/pages/HelpCenterPage.js
import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  ChevronDown,
  ChevronRight,
  FileText,
  CreditCard,
  Settings,
  Users
} from 'lucide-react';

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Getting Started",
      description: "Learn the basics of using ScholarlyAI",
      articles: ["Creating your first entry", "Understanding research focus", "Uploading documents"]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Billing & Plans",
      description: "Subscription management and billing",
      articles: ["Choosing a plan", "Managing billing", "Upgrading/downgrading"]
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Account Settings",
      description: "Profile and preference management",
      articles: ["Profile settings", "Privacy controls", "Data export"]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaboration",
      description: "Working with teams and sharing",
      articles: ["Team features", "Sharing entries", "Collaboration tools"]
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI-generated content?",
      answer: "Our AI uses advanced language models trained on academic literature. While highly accurate, we recommend reviewing all generated content for accuracy and compliance with your institution's standards."
    },
    {
      question: "What file formats do you support?",
      answer: "Currently, we support PDF files up to 10MB in size. We're working on adding support for Word documents and other academic formats."
    },
    {
      question: "Can I edit the generated bibliography entries?",
      answer: "Yes! All generated entries can be edited before export. You have full control over the final content."
    },
    {
      question: "How is my data protected?",
      answer: "We use enterprise-grade security with encryption, secure cloud storage, and don't permanently store your uploaded documents. Your data is processed securely and temporarily."
    },
    {
      question: "What citation styles are supported?",
      answer: "We support APA, MLA, and Chicago citation styles, with more formats being added regularly based on user feedback."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time through your account settings or by contacting support. No cancellation fees apply."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal font-playfair mb-4">
            Help Center
          </h1>
          <p className="text-xl text-charcoal/70 font-lato mb-8">
            Find answers and get support for ScholarlyAI
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Help Categories */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {categories.map((category, index) => (
                <div key={index} className="card card-hover">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-chestnut/10 rounded-lg flex items-center justify-center text-chestnut">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal font-playfair">{category.title}</h3>
                      <p className="text-sm text-charcoal/60 font-lato">{category.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {category.articles.map((article, idx) => (
                      <li key={idx} className="text-sm text-charcoal/70 hover:text-chestnut cursor-pointer">
                        {article}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <h2 className="text-2xl font-bold text-charcoal font-playfair mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="card">
                  <button
                    className="w-full text-left flex items-center justify-between"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <h3 className="font-semibold text-charcoal font-lato pr-4">{faq.question}</h3>
                    {openFAQ === index ? (
                      <ChevronDown className="w-5 h-5 text-charcoal/60" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-charcoal/60" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="mt-4 pt-4 border-t border-khaki/20">
                      <p className="text-charcoal/70 font-lato leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-chestnut" />
                </div>
                <h3 className="font-semibold text-charcoal font-playfair mb-2">Live Chat</h3>
                <p className="text-charcoal/70 font-lato mb-4 text-sm">
                  Get instant help from our support team
                </p>
                <button className="btn btn-primary w-full">Start Chat</button>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-chestnut" />
                </div>
                <h3 className="font-semibold text-charcoal font-playfair mb-2">Email Support</h3>
                <p className="text-charcoal/70 font-lato mb-4 text-sm">
                  Send us a detailed message
                </p>
                <a href="mailto:support@scholarlyaiapp.com" className="btn btn-outline w-full">
                  Send Email
                </a>
              </div>
            </div>

            <div className="card">
              <div className="text-center">
                <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-chestnut" />
                </div>
                <h3 className="font-semibold text-charcoal font-playfair mb-2">Documentation</h3>
                <p className="text-charcoal/70 font-lato mb-4 text-sm">
                  Detailed guides and tutorials
                </p>
                <button className="btn btn-outline w-full">View Docs</button>
              </div>
            </div>

            {/* Contact Hours */}
            <div className="bg-bone border border-khaki/30 rounded-lg p-4">
              <h4 className="font-semibold text-charcoal font-lato mb-2">Support Hours</h4>
              <div className="space-y-1 text-sm text-charcoal/70 font-lato">
                <p>Monday - Friday: 9 AM - 6 PM EST</p>
                <p>Saturday: 10 AM - 4 PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;