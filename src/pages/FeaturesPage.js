// src/pages/FeaturesPage.js
import React from 'react';
import { 
  Brain, 
  Sparkles, 
  Quote, 
  FileDown, 
  Target, 
  Zap, 
  Shield, 
  Users,
  BarChart3,
  Search,
  Clock,
  CheckCircle
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "AI-Powered Analysis",
      description: "Advanced GPT-4 technology analyzes your academic papers with deep understanding of research methodologies and academic writing conventions.",
      benefits: ["Contextual understanding", "Research-focus awareness", "Academic language processing"]
    },
    {
      icon: <Quote className="w-8 h-8 text-white" />,
      title: "Smart Quote Selection",
      description: "Automatically identifies the most impactful quotes from your documents with precise page citations and relevance scoring.",
      benefits: ["Impact-based selection", "Precise page citations", "Context preservation"]
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Research Focus Customization",
      description: "Tailor every analysis to your specific research area, ensuring relevant insights and targeted bibliographic entries.",
      benefits: ["Personalized analysis", "Domain-specific insights", "Relevant recommendations"]
    },
    {
      icon: <FileDown className="w-8 h-8 text-white" />,
      title: "Professional Export",
      description: "Generate properly formatted bibliography entries ready for academic papers, with multiple citation styles and export formats.",
      benefits: ["APA, MLA, Chicago styles", "Word document export", "Academic formatting"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: "Methodological Analysis",
      description: "Deep analysis of research methodologies, identifying strengths, limitations, and statistical significance of findings.",
      benefits: ["Methodology evaluation", "Statistical analysis", "Research quality assessment"]
    },
    {
      icon: <Search className="w-8 h-8 text-white" />,
      title: "Key Findings Extraction",
      description: "Automatically extracts and summarizes the most important research findings, data points, and statistical results.",
      benefits: ["Data extraction", "Statistical summarization", "Finding prioritization"]
    }
  ];

  const plans = [
    {
      name: "Free",
      entries: "5 lifetime entries",
      features: ["Basic AI analysis", "Standard citations", "Word export"]
    },
    {
      name: "Student",
      entries: "Unlimited entries",
      features: ["Advanced analysis", "Multiple citation styles", "Priority support"]
    },
    {
      name: "Researcher",
      entries: "Unlimited + Topic Generator",
      features: ["Topic & Outline Generator", "Premium analysis", "Research synthesis"]
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-charcoal font-playfair mb-6">
            Powerful Features for <span className="text-chestnut">Academic Research</span>
          </h1>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto font-lato">
            Discover how ScholarlyAI transforms your research workflow with cutting-edge AI technology 
            designed specifically for academic bibliography generation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="card card-hover">
              <div className="w-16 h-16 bg-gradient-chestnut rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-charcoal font-playfair mb-4">{feature.title}</h3>
              <p className="text-charcoal/70 font-lato mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-charcoal/60">
                    <CheckCircle className="w-4 h-4 text-chestnut" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-charcoal font-playfair text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chestnut">1</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">Upload Your Paper</h3>
              <p className="text-charcoal/70 font-lato">Upload your PDF and specify your research focus area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chestnut">2</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">AI Analysis</h3>
              <p className="text-charcoal/70 font-lato">Our AI analyzes content, methodology, and key findings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chestnut/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-chestnut">3</span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal font-playfair mb-2">Get Results</h3>
              <p className="text-charcoal/70 font-lato">Receive formatted bibliography entry ready for use</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-charcoal font-playfair text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`card ${index === 1 ? 'ring-2 ring-chestnut' : ''}`}>
                <h3 className="text-2xl font-bold text-charcoal font-playfair mb-2">{plan.name}</h3>
                <p className="text-chestnut font-semibold mb-4">{plan.entries}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-charcoal/70">
                      <CheckCircle className="w-4 h-4 text-chestnut" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="card bg-gradient-chestnut text-white text-center">
          <h2 className="text-3xl font-bold font-playfair mb-4">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-white/90 mb-8 font-lato">
            Join thousands of researchers using ScholarlyAI to streamline their bibliography workflow.
          </p>
          <button className="bg-white text-chestnut hover:bg-bone transition-colors px-8 py-4 rounded-lg font-semibold text-lg">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;