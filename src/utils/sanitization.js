// src/utils/sanitization.js
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - The potentially unsafe HTML string
 * @param {object} options - DOMPurify configuration options
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHtml = (dirty, options = {}) => {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const defaultOptions = {
    // Allow basic formatting tags
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
    // Allow basic attributes
    ALLOWED_ATTR: ['class'],
    // Remove script tags and attributes
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    // Strip comments
    ALLOW_DATA_ATTR: false,
    ...options
  };

  return DOMPurify.sanitize(dirty, defaultOptions);
};

/**
 * Sanitize plain text input to prevent XSS
 * @param {string} input - The input string
 * @returns {string} - Sanitized string
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags completely and decode HTML entities
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
};

/**
 * Sanitize research focus input
 * @param {string} researchFocus - The research focus string
 * @returns {string} - Sanitized research focus
 */
export const sanitizeResearchFocus = (researchFocus) => {
  if (!researchFocus || typeof researchFocus !== 'string') {
    return '';
  }

  // Allow basic text but remove any HTML tags
  let sanitized = sanitizeText(researchFocus);
  
  // Trim whitespace and limit length
  sanitized = sanitized.trim().substring(0, 200);
  
  return sanitized;
};

/**
 * Sanitize user display name
 * @param {string} displayName - The display name
 * @returns {string} - Sanitized display name
 */
export const sanitizeDisplayName = (displayName) => {
  if (!displayName || typeof displayName !== 'string') {
    return '';
  }

  // Remove HTML tags and special characters that could be problematic
  let sanitized = sanitizeText(displayName);
  
  // Allow only alphanumeric, spaces, hyphens, and apostrophes
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-']/g, '');
  
  // Trim and limit length
  sanitized = sanitized.trim().substring(0, 50);
  
  return sanitized;
};

/**
 * Sanitize bibliography content for display
 * @param {string} content - The bibliography content
 * @returns {string} - Sanitized content suitable for display
 */
export const sanitizeBibliographyContent = (content) => {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Allow more formatting for bibliography content but still sanitize
  return sanitizeHtml(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'iframe'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
  });
};

/**
 * Clean markdown-like formatting from text (remove ** and # symbols)
 * @param {string} text - Text with potential markdown formatting
 * @returns {string} - Clean text without markdown
 */
export const cleanMarkdownFormatting = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/#{1,6}\s+/g, '') // Remove header markdown
    .replace(/^\d+\.\s+/gm, '') // Remove numbered list formatting
    .replace(/^\*\s+/gm, '') // Remove bullet point formatting
    .replace(/^\-\s+/gm, '') // Remove dash bullet formatting
    .trim();
};

/**
 * Validate and sanitize email address
 * @param {string} email - Email address
 * @returns {string|null} - Sanitized email or null if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Sanitize and trim
  const sanitized = sanitizeText(email).toLowerCase().trim();
  
  // Validate format
  if (!emailRegex.test(sanitized)) {
    return null;
  }

  return sanitized;
};

/**
 * Sanitize search query
 * @param {string} query - Search query
 * @returns {string} - Sanitized search query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Remove HTML tags and trim
  let sanitized = sanitizeText(query).trim();
  
  // Limit length
  sanitized = sanitized.substring(0, 100);
  
  return sanitized;
};

/**
 * Comprehensive sanitization for form data
 * @param {object} formData - Form data object
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  if (!formData || typeof formData !== 'object') {
    return {};
  }

  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    if (typeof value === 'string') {
      switch (key) {
        case 'email':
          sanitized[key] = sanitizeEmail(value) || value;
          break;
        case 'displayName':
          sanitized[key] = sanitizeDisplayName(value);
          break;
        case 'researchFocus':
          sanitized[key] = sanitizeResearchFocus(value);
          break;
        case 'searchQuery':
          sanitized[key] = sanitizeSearchQuery(value);
          break;
        default:
          sanitized[key] = sanitizeText(value);
      }
    } else {
      // For non-string values, pass through as-is but be cautious
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeResearchFocus,
  sanitizeDisplayName,
  sanitizeBibliographyContent,
  cleanMarkdownFormatting,
  sanitizeEmail,
  sanitizeSearchQuery,
  sanitizeFormData,
};