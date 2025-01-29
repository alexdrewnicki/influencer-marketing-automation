type LogLevel = 'info' | 'warn' | 'error';

interface LogEvent {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userId?: string;
  sessionId: string;
  location: string;
}

class LoggerService {
  private static instance: LoggerService;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private createLogEvent(level: LogLevel, message: string, data?: any): LogEvent {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      userId: localStorage.getItem('userId'),
      sessionId: this.sessionId,
      location: window.location.pathname
    };
  }

  private async sendToServer(logEvent: LogEvent) {
    try {
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEvent),
        });
      }
      // Always log to console in development
      this.logToConsole(logEvent);
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  private logToConsole(logEvent: LogEvent) {
    const { level, message, data } = logEvent;
    switch (level) {
      case 'info':
        console.log(`[INFO] ${message}`, data);
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`, data);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`, data);
        break;
    }
  }

  public info(message: string, data?: any) {
    const logEvent = this.createLogEvent('info', message, data);
    this.sendToServer(logEvent);
  }

  public warn(message: string, data?: any) {
    const logEvent = this.createLogEvent('warn', message, data);
    this.sendToServer(logEvent);
  }

  public error(message: string, data?: any) {
    const logEvent = this.createLogEvent('error', message, data);
    this.sendToServer(logEvent);
  }

  public trackEvent(eventName: string, properties?: any) {
    this.info(`Event: ${eventName}`, properties);
  }

  public trackError(error: Error, context?: any) {
    this.error(error.message, {
      stack: error.stack,
      ...context
    });
  }
}

export const logger = LoggerService.getInstance();
