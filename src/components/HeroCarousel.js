// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import { FileText, Brain, BookOpen, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  { src: "/images/dashbioard.png", alt: "DraftEngine Dashboard Overview" },
  { src: "/images/source_analyzer.png", alt: "Source Analyzer Interface" },
  { src: "/images/outline_generator.png", alt: "Idea & Outline Generator" },
  { src: "/images/document_generator.png", alt: "Document Generator" }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "AI Writing Assistant — From Sources to Finished Drafts in Minutes",
      subtitle: "Complete writing workflow in one platform",
      description: "Upload PDFs, generate source summaries, create ideas & outlines, draft complete documents. DraftEngine handles every step from sources to final draft.",
      icon: Sparkles,
      iconColor: "text-purple-600",
      bgColor: "from-purple-50 via-white to-indigo-50",
      isMainHero: true,
      features: [
        "Articles & essays",
        "Reports & briefs",
        "Blog posts & content",
        "500-10,000 words"
      ]
    },
    {
      title: "Source Analyzer",
      subtitle: "Detailed summaries in 90 seconds",
      description: "Upload any PDF and get a complete source analysis. AI identifies key arguments, discovers interesting angles, and pulls notable passages with page numbers.",
      icon: FileText,
      iconColor: "text-accent",
      bgColor: "from-red-50 via-white to-orange-50",
      features: [
        "Key Arguments",
        "Interesting Angles",
        "Notable Passages",
        "Quotes with page numbers"
      ]
    },
    {
      title: "Idea & Outline Generator",
      subtitle: "AI-powered content ideas from YOUR sources",
      description: "After building your source library, generate content ideas and complete outlines based on your sources. AI identifies opportunities and creates structured document outlines tied directly to your sources.",
      icon: Brain,
      iconColor: "text-green-600",
      bgColor: "from-green-50 via-white to-teal-50",
      features: [
        "Identifies content opportunities",
        "3-5 topic suggestions",
        "Complete document outlines",
        "Source-backed sections"
      ]
    },
    {
      title: "Complete Document Generator",
      subtitle: "Fully-referenced drafts in minutes",
      description: "Turn your sources and outline into a complete document. Choose your document type, word count, writing approach, and tone. AI generates polished, source-backed content ready for editing.",
      icon: BookOpen,
      iconColor: "text-indigo-600",
      bgColor: "from-indigo-50 via-white to-violet-50",
      features: [
        "2,500-10,000 words",
        "Multiple document types",
        "Natural source attribution",
        "Export to Word/PDF"
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const heroImage = heroImages[currentSlide];

  return (
    <div className="relative">
      {/* Decorative background orbs */}
      <div className="gradient-orb w-72 h-72 bg-accent-400 top-0 right-0" />
      <div className="gradient-orb w-96 h-96 bg-primary-400 -bottom-20 -left-20" />
      <div className="gradient-orb w-64 h-64 bg-violet-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Carousel Container */}
      <div className={`relative bg-gradient-to-br ${slide.bgColor} rounded-2xl overflow-hidden`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-6 py-12 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Content */}
                <div className="order-2 lg:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0, duration: 0.4 }}
                    className="mb-4"
                  >
                    <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wide">
                      {slide.subtitle}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    {slide.isMainHero ? (
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                        {slide.title}
                      </h1>
                    ) : (
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                        {slide.title}
                      </h2>
                    )}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-lg text-secondary-800 mb-6 leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="grid grid-cols-2 gap-3 mb-6"
                  >
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="text-sm text-secondary-700">{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Right: Image */}
                <div className="order-1 lg:order-2">
                  <div className="bg-white rounded-xl shadow-2xl border border-secondary-200 overflow-hidden">
                    <img
                      src={heroImage.src}
                      alt={heroImage.alt}
                      className="w-full object-cover"
                      style={{ aspectRatio: '16/10' }}
                      loading="eager"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Navigation */}
      <div className="flex items-center justify-center space-x-3 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`p-2 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-full ${
              index === currentSlide
                ? ''
                : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`transition-all ${
              index === currentSlide
                ? 'w-8 h-2 bg-accent rounded-full'
                : 'w-2 h-2 bg-primary-900/30 rounded-full hover:bg-primary-900/50'
            }`} />
          </button>
        ))}
      </div>

      {/* Slide Labels */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        {slides.map((s, index) => {
          const SlideIcon = s.icon;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                index === currentSlide
                  ? 'bg-accent text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-300/30'
              }`}
            >
              <div className="flex items-center space-x-1">
                <SlideIcon className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {s.subtitle.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroCarousel;
