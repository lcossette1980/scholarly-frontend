// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import { Upload, Search, PenTool, Rss } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  { src: "/images/dashbioard.png", alt: "DraftEngine Dashboard Overview" },
  { src: "/images/source_analyzer.png", alt: "Source Analyzer Interface" },
  { src: "/images/outline_generator.png", alt: "Topic & Outline Generator" },
  { src: "/images/document_generator.png", alt: "Research Feeds" }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Import from Anywhere",
      subtitle: "Bring your sources in seconds",
      label: "Import",
      description: "PDFs, URLs, DOIs, RSS feeds — bring your sources into DraftEngine in seconds. Paste a URL and article text is extracted automatically. Look up any DOI through CrossRef. Your research, one library.",
      icon: Upload,
      iconColor: "text-primary-600",
      bgColor: "from-primary-50 via-white to-primary-50/30",
      isMainHero: true,
      features: [
        "Upload PDFs, any length",
        "Paste URLs, auto-extract text",
        "DOI lookup via CrossRef",
        "RSS feed import"
      ]
    },
    {
      title: "AI Source Analysis",
      subtitle: "Deep analysis in 90 seconds",
      label: "Analyze",
      description: "Every source is analyzed by AI to surface what matters most. Key arguments, interesting angles, perspective value, and notable passages — extracted and organized so you can write with confidence.",
      icon: Search,
      iconColor: "text-primary",
      bgColor: "from-primary-50 via-white to-accent-50/30",
      features: [
        "Key arguments identified",
        "Interesting angles surfaced",
        "Perspective value assessed",
        "Notable passages extracted"
      ]
    },
    {
      title: "Generate with Quality Agents",
      subtitle: "Editorial-quality documents, automatically",
      label: "Generate",
      description: "Full documents from 500 to 10,000 words with built-in quality review. Quality agents evaluate every section, check document coherence, and auto-regenerate weak passages. Citations and AI illustrations included.",
      icon: PenTool,
      iconColor: "text-accent-600",
      bgColor: "from-accent-50 via-white to-primary-50/30",
      features: [
        "Section-level quality review",
        "APA, MLA, Chicago citations",
        "DALL-E editorial illustrations",
        "4 document types, 4 tones"
      ]
    },
    {
      title: "Research Feeds",
      subtitle: "New papers, delivered automatically",
      label: "Feeds",
      description: "Subscribe to the topics that matter to your work. DraftEngine pulls new papers from Semantic Scholar, OpenAI, and CrossRef and delivers them straight to your library — so you never miss a relevant study.",
      icon: Rss,
      iconColor: "text-primary-600",
      bgColor: "from-primary-50 via-white to-primary-50/30",
      features: [
        "Subscribe to any topic",
        "Semantic Scholar integration",
        "OpenAI & CrossRef sources",
        "Auto-delivered to your library"
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
      {/* Carousel Container */}
      <div className={`relative bg-gradient-to-br ${slide.bgColor} rounded-lg overflow-hidden`}>
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
                    className="grid grid-cols-2 gap-4 mb-6"
                  >
                    {slide.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
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
            className={`p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ${
              index === currentSlide
                ? ''
                : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`transition-all ${
              index === currentSlide
                ? 'w-8 h-2 bg-primary rounded-full'
                : 'w-2 h-2 bg-primary/30 rounded-full hover:bg-primary/50'
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
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                index === currentSlide
                  ? 'bg-primary text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-300/30'
              }`}
            >
              <div className="flex items-center space-x-1">
                <SlideIcon className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {s.label || s.title}
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
