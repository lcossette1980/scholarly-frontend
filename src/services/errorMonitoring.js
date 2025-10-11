// src/services/errorMonitoring.js
import * as Sentry from '@sentry/react';

// Initialize Sentry
export const initErrorMonitoring = () => {
  // Only initialize in production or if explicitly enabled
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      
      beforeSend(event) {
        // Filter out specific errors that are not actionable
        if (event.exception) {
          const error = event.exception.values[0];
          if (error && error.value) {
            // Filter out network errors that are outside our control
            if (error.value.includes('Network Error') || 
                error.value.includes('Failed to fetch')) {
              return null;
            }
            
            // Filter out browser extension errors
            if (error.value.includes('extension://') || 
                error.value.includes('chrome-extension://') ||
                error.value.includes('moz-extension://')) {
              return null;
            }
          }
        }
        
        return event;
      },
    });
    
    console.log('Error monitoring initialized');
  } else {
    console.log('Error monitoring disabled (development mode)');
  }
};

// Log error with context
export const logError = (error, context = {}) => {
  console.error('Error occurred:', error, context);
  
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.withScope((scope) => {
      // Add context to the error
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
      
      // Set user context if available
      if (context.user) {
        scope.setUser({
          id: context.user.uid,
          email: context.user.email,
        });
      }
      
      // Capture the error
      if (error instanceof Error) {
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(error, 'error');
      }
    });
  }
};

// Log warning
export const logWarning = (message, context = {}) => {
  console.warn('Warning:', message, context);
  
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach(key => {
        scope.setContext(key, context[key]);
      });
      
      Sentry.captureMessage(message, 'warning');
    });
  }
};

// Set user context
export const setUserContext = (user) => {
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.setUser({
      id: user.uid,
      email: user.email,
      username: user.displayName,
    });
  }
};

// Clear user context (on logout)
export const clearUserContext = () => {
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.setUser(null);
  }
};

// Add breadcrumb for debugging
export const addBreadcrumb = (message, category = 'user', level = 'info') => {
  if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLE_ERROR_MONITORING === 'true') {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  }
};

// Higher-order component for error boundaries
export const withErrorBoundary = (Component, errorFallback = null) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: errorFallback || (({ error, resetError }) => (
      <div className="min-h-screen bg-pearl flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-secondary-900 font-playfair mb-4">
            Something went wrong
          </h2>
          <p className="text-secondary-700 font-lato mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </p>
          <button
            onClick={resetError}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    )),
    beforeCapture: (scope, error, hint) => {
      // Add additional context before sending to Sentry
      scope.setTag('component', 'react-error-boundary');
    },
  });
};

export default {
  initErrorMonitoring,
  logError,
  logWarning,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  withErrorBoundary,
};