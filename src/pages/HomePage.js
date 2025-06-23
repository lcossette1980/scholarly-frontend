// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Quote, FileDown, Brain, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-white" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI extracts key findings, methodology, and insights tailored to your research focus."
    },
    {
      icon: <Quote className="w-6 h-6 text-white" />,
      title: "Smart Quote Selection",
      description: "Automatically identifies the most impactful quotes with precise page citations."
    },
    {
      icon: <FileDown className="w-6 h-6 text-white" />,
      title: "Professional Export",
      description: "Export formatted bibliographies directly to Word with academic styling."
    }
  ];

  const testimonials = [
    {
      quote: "ScholarlyAI has revolutionized my research workflow. What used to take a few hours or days now takes minutes.",
      author: "Dr. Sarah Chen",
      role: "Research Professor"
    },
    {
      quote: "The AI analysis is incredibly accurate and captures nuances I might have missed. It is truly my partner.",
      author: "Michael Rodriguez",
      role: "PhD Candidate"
    },
    {
      quote: "Perfect for my research projects and papers!! The time savings are substantial, and my productivity has increased.",
      author: "Emily Watson",
      role: "Undergraduate Student"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
                       
            <h1 className="text-5xl lg:text-7xl font-bold text-charcoal font-playfair mb-6 text-shadow-lg">
              Transform Research Papers into{' '}
              <span className="text-gradient">Scholarly Annotations</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-charcoal/80 mb-10 max-w-3xl mx-auto leading-relaxed font-lato">
              Upload academic papers and receive comprehensive annotated bibliography entries with AI-powered analysis, key findings extraction, and methodological insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to={currentUser ? "/create" : "/signup"} 
                className="btn btn-primary text-lg px-8 py-4 group"
              >
                {currentUser ? "Create Entry" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/pricing" className="btn btn-outline text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-charcoal/60">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-chestnut" />
                <span>Free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-chestnut" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-chestnut" />
                <span>5 entries free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-6">
              Why Researchers Choose <span className="text-chestnut">ScholarlyAI</span>
            </h2>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto font-lato">
              Built specifically for academic research, our AI understands the nuances of scholarly work and delivers professional-grade annotations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="card card-hover group">
                <div className="w-12 h-12 bg-gradient-chestnut rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">{feature.title}</h3>
                <p className="text-charcoal/70 leading-relaxed font-lato">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-6">
              See It In <span className="text-chestnut">Action</span>
            </h2>
            <p className="text-lg text-charcoal/70 font-lato">
              Watch how ScholarlyAI transforms a research paper into a comprehensive annotated bibliography entry in minutes.
            </p>
          </div>
          
          <div className="card max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-chestnut rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse-gentle" />
                <h3 className="text-2xl font-bold font-playfair mb-2">Interactive Demo</h3>
                <p className="text-white/80 font-lato">Coming soon - Experience the full workflow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-6">
              Trusted by <span className="text-chestnut">Researchers</span> Worldwide
            </h2>
            <div className="flex items-center justify-center space-x-2 text-charcoal/60">
              <Users className="w-5 h-5" />
              <span className="font-lato">Join 10,000+ researchers already using ScholarlyAI</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <Quote className="w-8 h-8 text-chestnut mb-4" />
                <p className="text-charcoal/80 leading-relaxed mb-6 font-lato">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-charcoal font-lato">{testimonial.author}</p>
                  <p className="text-sm text-charcoal/60 font-lato">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="card max-w-4xl mx-auto text-center bg-gradient-chestnut text-white">
            <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
              Ready to Transform Your Research Workflow?
            </h2>
            <p className="text-xl text-white/90 mb-8 font-lato">
              Join thousands of researchers who save hours every week with ScholarlyAI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to={currentUser ? "/create" : "/signup"} 
                className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
              >
                {currentUser ? "Create Your First Entry" : "Start Free Trial"}
              </Link>
              <Link 
                to="/pricing" 
                className="border-2 border-white text-white hover:bg-white hover:text-chestnut transition-colors px-8 py-4 rounded-lg font-semibold text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;