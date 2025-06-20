// src/utils/validation.js
export const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (file.type !== 'application/pdf') {
      errors.push('File must be a PDF');
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size must be less than 10MB');
    }
    
    // Check file name
    if (!file.name || file.name.length < 4) {
      errors.push('Invalid file name');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  export const validateResearchFocus = (focus) => {
    const errors = [];
    
    if (!focus || focus.trim().length === 0) {
      errors.push('Research focus is required');
    }
    
    if (focus && focus.length < 3) {
      errors.push('Research focus must be at least 3 characters');
    }
    
    if (focus && focus.length > 100) {
      errors.push('Research focus must be less than 100 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };