import { logger } from './loggerService';
import { performanceMonitor } from './performanceMonitor';

export const monitoring = {
  // Logging
  logInfo: (message: string, data?: any) => logger.info(message, data),
  logWarning: (message: string, data?: any) => logger.warn(message, data),
  logError: (message: string, data?: any) => logger.error(message, data),

  // Event tracking
  trackEvent: (eventName: string, properties?: any) => logger.trackEvent(eventName, properties),
  trackError: (error: Error, context?: any) => logger.trackError(error, context),

  // Performance monitoring
  trackTiming: (name: string, fn: () => any) => performanceMonitor.trackTiming(name, fn),
  trackAsyncTiming: (name: string, fn: () => Promise<any>) => performanceMonitor.trackAsyncTiming(name, fn),
  createTimingMark: (name: string) => performanceMonitor.markAndMeasure(name),
};

// Error boundary integration
window.onerror = (message, source, lineno, colno, error) => {
  logger.error('Global error caught', {
    message,
    source,
    lineno,
    colno,
    error: error?.stack
  });
};

// Unhandled promise rejection handling
window.onunhandledrejection = (event) => {
  logger.error('Unhandled promise rejection', {
    reason: event.reason
  });
};
