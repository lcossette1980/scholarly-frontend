// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Brain, BookOpen, Sparkles, CheckCircle } from 'lucide-react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "From Research Articles to Published Paper in Hours",
      subtitle: "Complete academic workflow in one platform",
      description: "Upload PDFs, generate bibliographies, create topics & outlines, write complete papers. ScholarlyAI handles every step from research to final draft.",
      icon: Sparkles,
      iconColor: "text-purple-600",
      bgColor: "from-purple-50 via-white to-blue-50",
      image: "/images/hero-overview.png",
      features: [
        "Research papers & essays",
        "Conference papers",
        "Blog posts & articles",
        "500-10,000 words"
      ]
    },
    {
      title: "Bibliography Generator",
      subtitle: "Perfect bibliographies in 90 seconds",
      description: "Upload any academic PDF and get a complete annotated bibliography entry. AI extracts citations, summarizes findings, identifies methodologies, and pulls smart quotes with page numbers.",
      icon: FileText,
      iconColor: "text-chestnut",
      bgColor: "from-red-50 via-white to-orange-50",
      image: "/images/hero-bibliography.png",
      features: [
        "APA, MLA, Chicago, Harvard",
        "Auto-citation extraction",
        "Key findings summary",
        "Quotes with page numbers"
      ]
    },
    {
      title: "Topic & Outline Generator",
      subtitle: "AI-powered research topics from YOUR sources",
      description: "After building your bibliography, generate research topics and complete outlines based on your sources. AI identifies research gaps and creates structured paper outlines tied directly to your bibliography.",
      icon: Brain,
      iconColor: "text-green-600",
      bgColor: "from-green-50 via-white to-teal-50",
      image: "/images/hero-topic-outline.png",
      features: [
        "Identifies research gaps",
        "3-5 topic suggestions",
        "Complete paper outlines",
        "Source-backed sections"
      ]
    },
    {
      title: "Complete Paper Generator",
      subtitle: "Fully-cited papers in minutes",
      description: "Turn your bibliography and outline into a complete academic paper. Choose your document type, word count, citation style, and tone. AI generates properly formatted, fully-cited content ready for editing.",
      icon: BookOpen,
      iconColor: "text-blue-600",
      bgColor: "from-blue-50 via-white to-indigo-50",
      image: "/images/hero-paper-generator.png",
      features: [
        "2,500-10,000 words",
        "Multiple document types",
        "Inline citations",
        "Export to Word/PDF"
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className={`relative bg-gradient-to-br ${slide.bgColor} rounded-2xl overflow-hidden transition-all duration-500`}>
        <div className="container mx-auto px-6 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md`}>
                  <Icon className={`w-6 h-6 ${slide.iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-charcoal/60 uppercase tracking-wide">
                  {slide.subtitle}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal font-playfair mb-6 leading-tight">
                {slide.title}
              </h2>

              <p className="text-lg text-charcoal/80 mb-6 leading-relaxed font-lato">
                {slide.description}
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {slide.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className={`w-4 h-4 ${slide.iconColor} flex-shrink-0`} />
                    <span className="text-sm text-charcoal/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image Placeholder */}
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="aspect-[4/3] flex items-center justify-center bg-gray-50">
                  <div className="text-center p-8">
                    <Icon className={`w-24 h-24 ${slide.iconColor} mx-auto mb-4 opacity-50`} />
                    <p className="text-gray-400 text-sm">
                      {slide.image}
                      <br />
                      <span className="text-xs">(Placeholder for screenshot)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10 focus:outline-none focus:ring-2 focus:ring-chestnut focus:ring-offset-2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-charcoal" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all z-10 focus:outline-none focus:ring-2 focus:ring-chestnut focus:ring-offset-2"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-charcoal" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex items-center justify-center space-x-3 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`p-2 transition-all focus:outline-none focus:ring-2 focus:ring-chestnut focus:ring-offset-2 rounded-full ${
              index === currentSlide
                ? ''
                : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`transition-all ${
              index === currentSlide
                ? 'w-8 h-2 bg-chestnut rounded-full'
                : 'w-2 h-2 bg-charcoal/30 rounded-full hover:bg-charcoal/50'
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
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-chestnut focus:ring-offset-2 ${
                index === currentSlide
                  ? 'bg-chestnut text-white'
                  : 'bg-white text-charcoal/60 hover:bg-bone border border-khaki/30'
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
