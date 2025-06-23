export const wordExportConfig = {
  // Document branding
  branding: {
    companyName: 'ScholarlyAI',
    tagline: 'A Comprehensive Academic Reference Collection',
    watermark: false
  },
  
  // Typography settings
  typography: {
    fonts: {
      heading: 'Georgia',
      body: 'Times New Roman',
      accent: 'Arial'
    },
    sizes: {
      title: 56,
      subtitle: 28,
      heading1: 32,
      heading2: 28,
      heading3: 24,
      body: 24,
      caption: 20,
      footer: 18
    }
  },
  
  // Color scheme
  colors: {
    primary: '2C3E50',      // Dark blue-gray
    secondary: '34495E',    // Medium blue-gray
    accent: '3498DB',       // Bright blue
    text: '000000',         // Black
    muted: '7F8C8D'        // Light gray
  },
  
  // Spacing configuration (in twips - 1 inch = 1440 twips)
  spacing: {
    beforeHeading: 360,     // 0.25 inch
    afterHeading: 240,      // 0.167 inch
    paragraph: 240,         // 0.167 inch
    line: 360,             // 0.25 inch
    listItem: 120          // 0.083 inch
  },
  
  // Page layout
  layout: {
    margins: {
      top: 1,              // inches
      right: 1,            // inches
      bottom: 1,           // inches
      left: 1              // inches
    },
    orientation: 'portrait',
    size: 'letter'
  },
  
  // Export options
  options: {
    includeTitlePage: true,
    includeTableOfContents: true,
    includeHeaders: true,
    includeFooters: true,
    includePageNumbers: true,
    includeSectionBreaks: true,
    includeGenerationDate: true
  },
  
  // Content cleaning options
  cleaning: {
    removeMarkdown: true,
    removeHtml: true,
    preserveFormatting: true,
    convertLists: true,
    cleanWhitespace: true
  },
  
  // Section configuration
  sections: {
    citation: {
      style: 'bold',
      spacing: 'large'
    },
    overview: {
      title: 'Narrative Overview',
      style: 'justified'
    },
    components: {
      title: 'Key Research Components',
      includeSubheadings: true
    },
    findings: {
      title: 'Core Findings & Key Statistics',
      bulletStyle: 'disc'
    },
    methodology: {
      title: 'Methodological Value',
      includeStrengths: true,
      includeLimitations: true
    },
    quotes: {
      title: 'Key Quotes',
      style: 'italic',
      includePageNumbers: true
    }
  }
};