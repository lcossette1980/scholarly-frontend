// src/pages/HelpCenterPage.js
import React, { useState } from 'react';
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  FileText,
  CreditCard,
  Settings,
  Users,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { submitSupportMessage } from '../services/support';
import toast from 'react-hot-toast';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/motion';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenterPage = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please sign in to send a support message');
      return;
    }

    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSupportMessage(contactForm);
      toast.success('Message sent! We\'ll respond within 24 hours.');
      setContactForm({ subject: '', category: 'general', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const helpContent = {
    "Creating your first entry": {
      title: "Creating Your First Entry",
      content: [
        {
          subtitle: "Step 1: Upload Your Document",
          text: "Click the 'Create Entry' button from your dashboard. Upload a PDF file (up to 10MB) of the document you want to analyze. Supported formats include papers, journal articles, and documents."
        },
        {
          subtitle: "Step 2: Set Your Focus",
          text: "Enter a specific focus or question that guides the AI analysis. For example: 'Impact of social media on teenage mental health' or 'Machine learning applications in healthcare.' The more specific your focus, the more targeted your analysis will be."
        },
        {
          subtitle: "Step 3: Review Generated Content",
          text: "The AI will analyze your document and generate a comprehensive source summary entry including key findings, methodology insights, and relevant quotes with page citations."
        },
        {
          subtitle: "Step 4: Edit and Export",
          text: "Review the generated content, make any necessary edits, and export your formatted source summary entry to Word or copy it to your preferred citation manager."
        }
      ]
    },
    "Understanding research focus": {
      title: "Understanding Your Focus",
      content: [
        {
          subtitle: "What is a Focus?",
          text: "Your focus is the lens through which the AI analyzes your document. It should be a specific question, topic, or angle that you want the AI to emphasize when extracting insights."
        },
        {
          subtitle: "Examples of Good Focus",
          text: "• 'Environmental impact of renewable energy adoption'\n• 'Effectiveness of cognitive behavioral therapy for anxiety'\n• 'Social factors influencing voter behavior in urban areas'\n• 'Machine learning bias in facial recognition systems'"
        },
        {
          subtitle: "Tips for Better Results",
          text: "Be specific rather than broad. Instead of 'education,' use 'impact of technology on elementary school learning outcomes.' The AI can then highlight relevant sections and provide more targeted analysis."
        }
      ]
    },
    "Uploading documents": {
      title: "Uploading Documents",
      content: [
        {
          subtitle: "Supported File Types",
          text: "Currently, we support PDF files up to 10MB in size. We're working on adding support for Word documents, PowerPoint presentations, and other formats."
        },
        {
          subtitle: "Best Practices",
          text: "• Ensure your PDF is text-based (not just scanned images)\n• Papers with clear structure work best\n• Remove any password protection before uploading\n• Check that all pages are properly formatted"
        },
        {
          subtitle: "Upload Process",
          text: "Simply drag and drop your file or click to browse. The upload typically takes 5-15 seconds depending on file size. You'll see a progress bar during upload."
        },
        {
          subtitle: "Troubleshooting",
          text: "If upload fails, check your internet connection and ensure the file isn't corrupted. Contact support if you continue experiencing issues."
        }
      ]
    },
    "Choosing a plan": {
      title: "Choosing the Right Plan",
      content: [
        {
          subtitle: "Free Plan",
          text: "Perfect for trying DraftEngine. Includes 5 source summary entries to test our features and see if the platform meets your needs."
        },
        {
          subtitle: "Plus Plan - $9.99/month",
          text: "Ideal for regular users. Includes 50 entries per month, all writing features, and priority support."
        },
        {
          subtitle: "Pro Plan - $19.99/month",
          text: "For power users and professionals. Includes 200 entries per month, advanced analysis features, team collaboration, and priority processing."
        },
        {
          subtitle: "Institution Plan - Custom Pricing",
          text: "For organizations and institutions. Includes unlimited entries, admin dashboard, usage analytics, custom integrations, and dedicated support."
        }
      ]
    },
    "Managing billing": {
      title: "Managing Your Billing",
      content: [
        {
          subtitle: "Viewing Your Subscription",
          text: "Access your billing information through Profile > Billing. Here you can see your current plan, next billing date, and usage statistics."
        },
        {
          subtitle: "Updating Payment Methods",
          text: "Click 'Update Payment Method' to change your credit card information. We accept all major credit cards and process payments securely through Stripe."
        },
        {
          subtitle: "Downloading Invoices",
          text: "All invoices are available in your billing section. Click 'Download Invoice' for any past payment to get a PDF copy for your records."
        },
        {
          subtitle: "Usage Tracking",
          text: "Monitor your monthly usage to ensure you're on the right plan. Upgrade notifications will appear when you approach your limit."
        }
      ]
    },
    "Upgrading/downgrading": {
      title: "Changing Your Plan",
      content: [
        {
          subtitle: "Upgrading Your Plan",
          text: "Upgrade anytime through Profile > Billing > Change Plan. Upgrades take effect immediately, and you'll be prorated for the remaining billing period."
        },
        {
          subtitle: "Downgrading Your Plan",
          text: "Downgrades take effect at the end of your current billing cycle. You'll retain access to premium features until then. Unused entries don't carry over between plans."
        },
        {
          subtitle: "Plan Comparison",
          text: "Use our plan comparison tool to see which features are included with each plan. Consider your monthly usage and required features when choosing."
        },
        {
          subtitle: "Cancellation",
          text: "Cancel anytime without fees. You'll retain access until the end of your billing period. Reactivate your subscription anytime to restore full access."
        }
      ]
    },
    "Profile settings": {
      title: "Managing Profile Settings",
      content: [
        {
          subtitle: "Basic Information",
          text: "Update your name, email, and institution affiliation in Profile > Settings. Email changes require verification for security."
        },
        {
          subtitle: "Notification Preferences",
          text: "Control when you receive emails about usage limits, new features, and account updates. Customize your notification frequency and types."
        },
        {
          subtitle: "Default Writing Preferences",
          text: "Set your preferred writing approach and tone to save time. This becomes the default for all new content, though you can change it per document."
        },
        {
          subtitle: "Institution",
          text: "Adding your institution helps us provide relevant features and may qualify you for educational discounts or institutional access."
        }
      ]
    },
    "Privacy controls": {
      title: "Privacy and Data Controls",
      content: [
        {
          subtitle: "Data Processing",
          text: "We process your documents temporarily to generate source summary entries. Documents are not permanently stored and are deleted after processing."
        },
        {
          subtitle: "Account Data",
          text: "Your source summary entries, focuses, and account information are securely stored and encrypted. Only you have access to your content."
        },
        {
          subtitle: "Data Export",
          text: "Export all your data anytime through Profile > Privacy > Export Data. You'll receive a comprehensive file with all your entries and account information."
        },
        {
          subtitle: "Account Deletion",
          text: "Delete your account and all associated data permanently through Profile > Privacy > Delete Account. This action cannot be undone."
        }
      ]
    },
    "Data export": {
      title: "Exporting Your Data",
      content: [
        {
          subtitle: "Individual Entry Export",
          text: "Export individual source summary entries to Word format with formatting preserved. Use the 'Export' button on any entry."
        },
        {
          subtitle: "Bulk Export",
          text: "Export multiple entries at once from your dashboard. Select entries and choose 'Export Selected' to download a combined document."
        },
        {
          subtitle: "Citation Manager Integration",
          text: "Export citations in BibTeX, RIS, or EndNote formats for import into Zotero, Mendeley, or other citation managers."
        },
        {
          subtitle: "Complete Data Export",
          text: "Request a complete export of all your account data, including entries, settings, and usage history through Profile > Privacy settings."
        }
      ]
    },
    "Team features": {
      title: "Team Collaboration Features",
      content: [
        {
          subtitle: "Creating Teams",
          text: "Available on Pro and Institution plans. Create teams for groups, classes, or collaborative projects. Invite members via email."
        },
        {
          subtitle: "Shared Libraries",
          text: "Team members can access shared source summary entries, making collaboration seamless. Set permissions for view-only or edit access."
        },
        {
          subtitle: "Team Analytics",
          text: "Track team usage, popular focuses, and collaboration patterns through the team dashboard. Available to team administrators."
        },
        {
          subtitle: "Role Management",
          text: "Assign roles (Admin, Editor, Viewer) to control access levels. Admins can manage billing, add/remove members, and adjust settings."
        }
      ]
    },
    "Sharing entries": {
      title: "Sharing Source Summary Entries",
      content: [
        {
          subtitle: "Public Links",
          text: "Generate shareable links for individual entries. Recipients can view the entry without needing a DraftEngine account. Links can be password-protected."
        },
        {
          subtitle: "Team Sharing",
          text: "Share entries directly with team members. They'll appear in the shared library with appropriate permissions based on user roles."
        },
        {
          subtitle: "Export and Share",
          text: "Export entries to common formats and share via email, cloud storage, or collaborative platforms like Google Docs or Microsoft Teams."
        },
        {
          subtitle: "Privacy Controls",
          text: "Control sharing permissions and revoke access anytime. Set expiration dates for shared links to maintain security."
        }
      ]
    },
    "Collaboration tools": {
      title: "Collaboration Tools",
      content: [
        {
          subtitle: "Comment System",
          text: "Add comments to source summary entries for team feedback and discussion. Comments are threaded and support @mentions for notifications."
        },
        {
          subtitle: "Version History",
          text: "Track changes to shared entries with complete version history. Restore previous versions or see who made specific edits."
        },
        {
          subtitle: "Real-time Editing",
          text: "Multiple team members can edit entries simultaneously with real-time synchronization. See who's online and what they're working on."
        },
        {
          subtitle: "Review Workflow",
          text: "Set up approval workflows for shared entries. Designated reviewers can approve changes before they're finalized."
        }
      ]
    }
  };

  const categories = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Getting Started",
      description: "Learn the basics of using DraftEngine",
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
      answer: "Our AI uses advanced language models to produce high-quality content. While highly accurate, we recommend reviewing all generated content for accuracy and compliance with your institution's standards."
    },
    {
      question: "What file formats do you support?",
      answer: "Currently, we support PDF files up to 10MB in size. We're working on adding support for Word documents and other formats."
    },
    {
      question: "Can I edit the generated source summary entries?",
      answer: "Yes! All generated entries can be edited before export. You have full control over the final content."
    },
    {
      question: "How is my data protected?",
      answer: "We use enterprise-grade security with encryption, secure cloud storage, and don't permanently store your uploaded documents. Your data is processed securely and temporarily."
    },
    {
      question: "How are sources referenced in generated content?",
      answer: "DraftEngine uses natural attribution — weaving source references conversationally into your writing (e.g., 'According to Smith...' or 'Research from MIT shows...'). This keeps content readable while maintaining credibility."
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
    <div className="min-h-screen py-12 bg-mesh">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-secondary-700 mb-8">
              Find answers and get support for DraftEngine
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                className="form-input pl-10 focus:ring-2 focus:ring-accent/30 focus:shadow-lg focus:shadow-accent/10 transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Help Categories or Article Content */}
          <div className="lg:col-span-2">
            {selectedArticle ? (
              /* Article Content View */
              <FadeIn>
                <div>
                  <motion.button
                    whileHover={{ x: -4 }}
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center space-x-2 text-accent hover:text-accent-600/80 transition-colors mb-6"
                  >
                    <ChevronRight className="w-4 h-4 transform rotate-180" />
                    <span className="">Back to Help Center</span>
                  </motion.button>

                  <div className="card card-floating">
                    <h1 className="text-3xl font-bold text-secondary-900  mb-6">
                      {helpContent[selectedArticle]?.title}
                    </h1>

                    <div className="space-y-6">
                      {helpContent[selectedArticle]?.content.map((section, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                          <div>
                            <h3 className="text-xl font-semibold text-secondary-900  mb-3">
                              {section.subtitle}
                            </h3>
                            <p className="text-secondary-800  leading-relaxed whitespace-pre-line">
                              {section.text}
                            </p>
                          </div>
                        </FadeIn>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ) : (
              /* Categories and FAQ View */
              <>
                <FadeIn>
                  <h2 className="text-2xl font-bold text-secondary-900  mb-8">Browse by Category</h2>
                </FadeIn>
                <StaggerChildren>
                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {categories.map((category, index) => (
                      <StaggerItem key={index}>
                        <div className="card card-floating card-hover">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                              {category.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-secondary-900 ">{category.title}</h3>
                              <p className="text-sm text-secondary-600 ">{category.description}</p>
                            </div>
                          </div>
                          <ul className="space-y-1">
                            {category.articles.map((article, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-secondary-700 hover:text-accent-600 cursor-pointer transition-colors"
                                onClick={() => setSelectedArticle(article)}
                              >
                                {article}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerChildren>

                {/* FAQ Section */}
                <FadeIn>
                  <h2 className="text-2xl font-bold text-secondary-900  mb-8">
                    Frequently Asked Questions
                  </h2>
                </FadeIn>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <FadeIn key={index} delay={index * 0.05}>
                      <div className="card card-floating">
                        <button
                          className="w-full text-left flex items-center justify-between"
                          onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        >
                          <h3 className="font-semibold text-secondary-900  pr-4">{faq.question}</h3>
                          <motion.div
                            animate={{ rotate: openFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-secondary-600" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {openFAQ === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-secondary-300/20">
                                <p className="text-secondary-700  leading-relaxed">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Contact Support */}
          <div>
            <StaggerChildren>
              <div className="space-y-6">
                <StaggerItem>
                  <div className="card card-floating">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="font-semibold text-secondary-900  mb-2">Live Chat</h3>
                      <p className="text-secondary-700  mb-4 text-sm">
                        Get instant help from our support team
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn btn-primary w-full"
                      >
                        Start Chat
                      </motion.button>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="card glass-card lg:col-span-2">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 ">Contact Support</h3>
                        <p className="text-sm text-secondary-700 ">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="form-label">Subject</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Brief description of your issue"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={contactForm.category}
                          onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                        >
                          <option value="general">General Question</option>
                          <option value="bug">Bug Report</option>
                          <option value="feature">Feature Request</option>
                          <option value="billing">Billing Issue</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label">Message</label>
                        <textarea
                          className="form-input min-h-[150px]"
                          placeholder="Describe your issue or question in detail..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          required
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || !currentUser}
                        className="btn btn-primary w-full"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </motion.button>

                      {!currentUser && (
                        <p className="text-sm text-secondary-600 text-center">
                          Please sign in to send a support message
                        </p>
                      )}
                    </form>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="card card-floating">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Book className="w-8 h-8 text-accent" />
                      </div>
                      <h3 className="font-semibold text-secondary-900  mb-2">Documentation</h3>
                      <p className="text-secondary-700  mb-4 text-sm">
                        Detailed guides and tutorials
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn btn-outline w-full"
                      >
                        View Docs
                      </motion.button>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  {/* Contact Hours */}
                  <div className="bg-secondary-50 border border-secondary-300/30 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary-900  mb-2">Support Hours</h4>
                    <div className="space-y-1 text-sm text-secondary-700 ">
                      <p>Monday - Friday: 9 AM - 6 PM EST</p>
                      <p>Saturday: 10 AM - 4 PM EST</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </StaggerItem>
              </div>
            </StaggerChildren>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
