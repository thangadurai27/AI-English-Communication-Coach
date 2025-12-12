/**
 * Performance Monitoring and Optimization Utilities
 */

// Lazy load images with Intersection Observer
export const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
};

// Debounce function for performance optimization
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll/resize events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Measure Core Web Vitals
export const measureWebVitals = () => {
  if ('web-vital' in window) {
    return;
  }

  // Largest Contentful Paint (LCP)
  const observeLCP = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });
  observeLCP.observe({ type: 'largest-contentful-paint', buffered: true });

  // First Input Delay (FID)
  const observeFID = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const delay = entry.processingStart - entry.startTime;
      console.log('FID:', delay);
    }
  });
  observeFID.observe({ type: 'first-input', buffered: true });

  // Cumulative Layout Shift (CLS)
  let clsScore = 0;
  const observeCLS = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsScore += entry.value;
        console.log('CLS:', clsScore);
      }
    }
  });
  observeCLS.observe({ type: 'layout-shift', buffered: true });
};

// Preload critical resources
export const preloadResource = (href, as, type = null) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Check network connection quality
export const getNetworkQuality = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  return null;
};

// Adaptive loading based on network
export const shouldLoadHeavyContent = () => {
  const network = getNetworkQuality();
  if (!network) return true;
  
  // Don't load heavy content on slow connections or data saver mode
  if (network.saveData || network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
    return false;
  }
  return true;
};

// Prefetch route on link hover (for faster navigation)
export const prefetchRoute = (path) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
};

// Service Worker registration helper
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Cache API helpers
export const cacheData = async (cacheName, url, data) => {
  const cache = await caches.open(cacheName);
  const response = new Response(JSON.stringify(data));
  await cache.put(url, response);
};

export const getCachedData = async (cacheName, url) => {
  const cache = await caches.open(cacheName);
  const response = await cache.match(url);
  if (response) {
    return await response.json();
  }
  return null;
};

// Optimize animations
export const useReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Bundle size tracker
export const logBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    resources.forEach(resource => {
      totalSize += resource.transferSize || 0;
    });
    console.log(`Total resources transferred: ${(totalSize / 1024).toFixed(2)} KB`);
  }
};

// Font loading optimization
export const optimizeFontLoading = () => {
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 1em Inter'),
      document.fonts.load('500 1em Inter'),
      document.fonts.load('600 1em Inter'),
      document.fonts.load('700 1em Inter'),
    ]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
};

export default {
  lazyLoadImages,
  debounce,
  throttle,
  measureWebVitals,
  preloadResource,
  isMobile,
  getNetworkQuality,
  shouldLoadHeavyContent,
  prefetchRoute,
  registerServiceWorker,
  cacheData,
  getCachedData,
  useReducedMotion,
  logBundleSize,
  optimizeFontLoading
};
