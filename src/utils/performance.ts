// Performance optimization utilities

// Debounce function to limit function calls
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit function execution rate
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory management utilities
export class MemoryManager {
  private static instance: MemoryManager;
  private cache = new Map<string, unknown>();
  private maxCacheSize = 100;

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  set(key: string, value: unknown): void {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  get(key: string): unknown {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

// Image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Batch preload images
export const preloadImages = async (srcs: string[]): Promise<void> => {
  const promises = srcs.map(src => preloadImage(src));
  await Promise.allSettled(promises);
};

// Audio preloading utility
export const preloadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve();
    audio.onerror = reject;
    audio.src = src;
    audio.load();
  });
};

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    performance.mark(`${label}-start`);
  }

  endTimer(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = measure.duration;
    
    const metrics = this.metrics.get(label) || [];
    metrics.push(duration);
    this.metrics.set(label, metrics);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    return duration;
  }

  getAverageTime(label: string): number {
    const metrics = this.metrics.get(label) || [];
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, val) => acc + val, 0);
    return sum / metrics.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [label] of this.metrics.entries()) {
      result[label] = this.getAverageTime(label);
    }
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Request Animation Frame wrapper for smooth animations
export const requestAnimationFramePromise = (): Promise<number> => {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
};

// Batch DOM updates
export const batchDOMUpdates = (updates: (() => void)[]): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Memory usage monitoring
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export const getMemoryUsage = (): MemoryInfo | null => {
  if ('memory' in performance) {
    return (performance as { memory: MemoryInfo }).memory;
  }
  return null;
};

// Log memory usage
export const logMemoryUsage = (): void => {
  const memory = getMemoryUsage();
  if (memory) {
    console.log('Memory Usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
    });
  }
};

// Cleanup utilities
export const cleanup = (): void => {
  // Clear memory manager cache
  MemoryManager.getInstance().clear();
  
  // Clear performance metrics
  PerformanceMonitor.getInstance().clearMetrics();
  
  // Clear performance marks and measures
  performance.clearMarks();
  performance.clearMeasures();
  
  // Force garbage collection if available
  if ('gc' in window) {
    (window as { gc: () => void }).gc();
  }
}; 