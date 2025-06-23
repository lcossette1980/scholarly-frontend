// src/config/environment.js

/**
 * Environment configuration validation and setup
 */

// Define required environment variables
const REQUIRED_ENV_VARS = {
  REACT_APP_API_URL: {
    description: 'Backend API URL',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_API_KEY: {
    description: 'Firebase API Key',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_AUTH_DOMAIN: {
    description: 'Firebase Auth Domain',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_PROJECT_ID: {
    description: 'Firebase Project ID',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_STORAGE_BUCKET: {
    description: 'Firebase Storage Bucket',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: {
    description: 'Firebase Messaging Sender ID',
    required: true,
    defaultValue: null,
  },
  REACT_APP_FIREBASE_APP_ID: {
    description: 'Firebase App ID',
    required: true,
    defaultValue: null,
  },
  REACT_APP_STRIPE_PUBLISHABLE_KEY: {
    description: 'Stripe Publishable Key',
    required: true,
    defaultValue: null,
  },
};

// Define optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  REACT_APP_STRIPE_STUDENT_PRICE_ID: {
    description: 'Stripe Student Plan Price ID',
    required: false,
    defaultValue: 'price_student_plan_default',
  },
  REACT_APP_STRIPE_RESEARCHER_PRICE_ID: {
    description: 'Stripe Researcher Plan Price ID',
    required: false,
    defaultValue: 'price_researcher_plan_default',
  },
  REACT_APP_STRIPE_INSTITUTION_PRICE_ID: {
    description: 'Stripe Institution Plan Price ID',
    required: false,
    defaultValue: 'price_institution_plan_default',
  },
  REACT_APP_SENTRY_DSN: {
    description: 'Sentry DSN for error monitoring',
    required: false,
    defaultValue: null,
  },
  REACT_APP_ENABLE_ERROR_MONITORING: {
    description: 'Enable error monitoring in development',
    required: false,
    defaultValue: 'false',
  },
  REACT_APP_ENABLE_ANALYTICS: {
    description: 'Enable analytics tracking',
    required: false,
    defaultValue: 'false',
  },
  REACT_APP_GOOGLE_ANALYTICS_ID: {
    description: 'Google Analytics Measurement ID',
    required: false,
    defaultValue: null,
  },
};

// Validation results
let validationResults = {
  isValid: true,
  errors: [],
  warnings: [],
  missingRequired: [],
  missingOptional: [],
};

/**
 * Validate a single environment variable
 */
const validateEnvVar = (key, config) => {
  const value = process.env[key];
  
  if (!value || value.trim() === '') {
    if (config.required) {
      validationResults.errors.push(
        `Missing required environment variable: ${key} (${config.description})`
      );
      validationResults.missingRequired.push(key);
      validationResults.isValid = false;
    } else {
      validationResults.warnings.push(
        `Missing optional environment variable: ${key} (${config.description})`
      );
      validationResults.missingOptional.push(key);
    }
    return config.defaultValue;
  }
  
  // Additional validation for specific variables
  if (key === 'REACT_APP_API_URL' && !value.startsWith('http')) {
    validationResults.errors.push(
      `Invalid ${key}: Must be a valid URL starting with http:// or https://`
    );
    validationResults.isValid = false;
  }
  
  if (key === 'REACT_APP_FIREBASE_PROJECT_ID' && !/^[a-z0-9-]+$/.test(value)) {
    validationResults.errors.push(
      `Invalid ${key}: Must contain only lowercase letters, numbers, and hyphens`
    );
    validationResults.isValid = false;
  }
  
  if (key.includes('STRIPE') && key.includes('KEY') && !value.startsWith('pk_')) {
    validationResults.warnings.push(
      `Warning: ${key} should typically start with 'pk_' for publishable keys`
    );
  }
  
  return value.trim();
};

/**
 * Validate all environment variables
 */
export const validateEnvironment = () => {
  // Reset validation results
  validationResults = {
    isValid: true,
    errors: [],
    warnings: [],
    missingRequired: [],
    missingOptional: [],
  };
  
  const config = {};
  
  // Validate required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, envConfig]) => {
    config[key] = validateEnvVar(key, envConfig);
  });
  
  // Validate optional variables
  Object.entries(OPTIONAL_ENV_VARS).forEach(([key, envConfig]) => {
    config[key] = validateEnvVar(key, envConfig);
  });
  
  // Log results
  if (validationResults.errors.length > 0) {
    console.error('❌ Environment Validation Failed:');
    validationResults.errors.forEach(error => console.error(`  • ${error}`));
  }
  
  if (validationResults.warnings.length > 0) {
    console.warn('⚠️  Environment Warnings:');
    validationResults.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }
  
  if (validationResults.isValid) {
    console.log('✅ Environment validation passed');
    
    // Log configuration summary (without sensitive values)
    console.log('📋 Configuration Summary:');
    console.log(`  • API URL: ${config.REACT_APP_API_URL}`);
    console.log(`  • Firebase Project: ${config.REACT_APP_FIREBASE_PROJECT_ID}`);
    console.log(`  • Stripe Integration: ${config.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`  • Error Monitoring: ${config.REACT_APP_SENTRY_DSN ? 'Enabled' : 'Disabled'}`);
    console.log(`  • Environment: ${process.env.NODE_ENV}`);
  }
  
  return {
    isValid: validationResults.isValid,
    config,
    results: validationResults,
  };
};

/**
 * Get environment configuration
 */
export const getEnvironmentConfig = () => {
  const validation = validateEnvironment();
  
  if (!validation.isValid) {
    const errorMessage = `Environment validation failed. Missing required variables: ${validation.results.missingRequired.join(', ')}`;
    
    // In development, show helpful error
    if (process.env.NODE_ENV === 'development') {
      console.error('\n🚨 SETUP REQUIRED 🚨');
      console.error('Create a .env file in your project root with the following variables:');
      console.error('');
      
      Object.entries(REQUIRED_ENV_VARS).forEach(([key, config]) => {
        if (validation.results.missingRequired.includes(key)) {
          console.error(`${key}=your_${key.toLowerCase().replace(/react_app_/g, '').replace(/_/g, '_')}_here`);
        }
      });
      
      console.error('\nOptional variables:');
      Object.entries(OPTIONAL_ENV_VARS).forEach(([key, config]) => {
        console.error(`# ${key}=your_${key.toLowerCase().replace(/react_app_/g, '').replace(/_/g, '_')}_here`);
      });
      console.error('');
    }
    
    throw new Error(errorMessage);
  }
  
  return validation.config;
};

/**
 * Get validation results without throwing
 */
export const getValidationResults = () => {
  return validateEnvironment().results;
};

/**
 * Check if running in production
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Get feature flags
 */
export const getFeatureFlags = () => {
  const config = getEnvironmentConfig();
  
  return {
    errorMonitoring: config.REACT_APP_ENABLE_ERROR_MONITORING === 'true' || isProduction(),
    analytics: config.REACT_APP_ENABLE_ANALYTICS === 'true' || isProduction(),
    stripePayments: !!config.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    sentryLogging: !!config.REACT_APP_SENTRY_DSN,
    googleAnalytics: !!config.REACT_APP_GOOGLE_ANALYTICS_ID,
  };
};

// Validate environment on module load (but don't throw in tests)
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnvironment();
  } catch (error) {
    // Don't throw during module loading, but log the error
    console.error('Environment validation failed:', error.message);
  }
}

export default {
  validateEnvironment,
  getEnvironmentConfig,
  getValidationResults,
  isProduction,
  isDevelopment,
  getFeatureFlags,
};