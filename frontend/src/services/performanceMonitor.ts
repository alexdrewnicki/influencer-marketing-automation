import { logger } from './loggerService';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Performance Observer for large rendering events
    if (PerformanceObserver) {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric('paint', entry.startTime, {
            type: entry.name
          });
        }
      });

      paintObserver.observe({ entryTypes: ['paint'] });

      // Long Task Observer
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric('longTask', entry.duration, {
            attribution: JSON.stringify(entry.attribution)
          });
        }
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private trackMetric(name: string, value: number, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      tags
    };

    logger.info(`Performance Metric: ${name}`, metric);
  }

  public trackTiming(name: string, fn: () => any) {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.trackMetric(name, duration);
    return result;
  }

  public async trackAsyncTiming(name: string, fn: () => Promise<any>) {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.trackMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.trackMetric(`${name}_error`, duration);
      throw error;
    }
  }

  public markAndMeasure(name: string) {
    if (performance.mark) {
      const startMark = `${name}_start`;
      const endMark = `${name}_end`;

      performance.mark(startMark);
      return () => {
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        const duration = entries[entries.length - 1].duration;
        this.trackMetric(name, duration);
      };
    }
    return () => {};
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
