/**
 * Mobile-specific utilities and optimizations
 */

// Detect touch device
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

// Get device type
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Get viewport dimensions
export const getViewport = () => {
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};

// Check if viewport is mobile size
export const isMobileViewport = () => {
  return getViewport().width < 768;
};

// Prevent scroll bounce on iOS
export const preventScrollBounce = () => {
  document.body.addEventListener('touchmove', (e) => {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });
};

// Handle safe area insets (for notch devices)
export const getSafeAreaInsets = () => {
  const computed = getComputedStyle(document.documentElement);
  return {
    top: computed.getPropertyValue('--sat') || '0px',
    right: computed.getPropertyValue('--sar') || '0px',
    bottom: computed.getPropertyValue('--sab') || '0px',
    left: computed.getPropertyValue('--sal') || '0px'
  };
};

// Optimize touch event handling
export const addTouchOptimization = () => {
  // Faster click handling for mobile
  let touchStartTime;
  let touchElement;

  document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
    touchElement = e.target;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 200 && e.target === touchElement) {
      // Fast tap detected - could trigger custom events
      const event = new CustomEvent('fasttap', { detail: e.target });
      e.target.dispatchEvent(event);
    }
  }, { passive: true });
};

// Disable zoom on double tap (optional, use carefully)
export const disableDoubleTapZoom = () => {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
};

// Handle orientation changes
export const onOrientationChange = (callback) => {
  window.addEventListener('orientationchange', () => {
    const orientation = screen.orientation?.type || 
      (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    callback(orientation);
  });
};

// Get orientation
export const getOrientation = () => {
  return screen.orientation?.type || 
    (window.innerHeight > window.innerWidth ? 'portrait-primary' : 'landscape-primary');
};

// Optimize keyboard handling on mobile
export const handleMobileKeyboard = () => {
  let viewportHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    const currentHeight = window.innerHeight;
    const diff = viewportHeight - currentHeight;
    
    // Keyboard is likely open if viewport shrinks significantly
    if (diff > 150) {
      document.body.classList.add('keyboard-open');
    } else {
      document.body.classList.remove('keyboard-open');
    }
    
    viewportHeight = currentHeight;
  });
};

// Smooth scroll polyfill for older mobile browsers
export const enableSmoothScroll = () => {
  // Modern browsers support smooth scroll natively
  // For older browsers, smooth scroll is not critical
  if ('scrollBehavior' in document.documentElement.style) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
};

// Add haptic feedback (if supported)
export const hapticFeedback = (type = 'light') => {
  if (navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type] || 10);
  }
};

// Optimize for notched devices (iPhone X+)
export const addNotchSupport = () => {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    const content = meta.getAttribute('content');
    if (!content.includes('viewport-fit')) {
      meta.setAttribute('content', `${content}, viewport-fit=cover`);
    }
  }
  
  // Add CSS variables for safe areas
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sat: env(safe-area-inset-top);
      --sar: env(safe-area-inset-right);
      --sab: env(safe-area-inset-bottom);
      --sal: env(safe-area-inset-left);
    }
  `;
  document.head.appendChild(style);
};

// Check if PWA is installed
export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Prompt PWA installation
export const promptPWAInstall = () => {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    return deferredPrompt;
  });
  
  return {
    show: async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome === 'accepted';
      }
      return false;
    }
  };
};

// Mobile-optimized scroll to element
export const scrollToElement = (element, options = {}) => {
  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };
  
  if (element) {
    element.scrollIntoView({ ...defaultOptions, ...options });
  }
};

// Detect if device is in landscape mode
export const isLandscape = () => {
  return window.innerWidth > window.innerHeight;
};

// Mobile-friendly focus handling
export const handleMobileFocus = () => {
  // Prevent zoom on input focus
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (isMobileViewport()) {
        // Scroll input into view with offset for keyboard
        setTimeout(() => {
          const rect = input.getBoundingClientRect();
          const offset = window.innerHeight / 3;
          if (rect.top > offset) {
            window.scrollBy({
              top: rect.top - offset,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    });
  });
};

// Initialize all mobile optimizations
export const initMobileOptimizations = () => {
  if (isMobileViewport() || isTouchDevice()) {
    addTouchOptimization();
    handleMobileKeyboard();
    addNotchSupport();
    handleMobileFocus();
    enableSmoothScroll();
  }
};

export default {
  isTouchDevice,
  getDeviceType,
  getViewport,
  isMobileViewport,
  preventScrollBounce,
  getSafeAreaInsets,
  addTouchOptimization,
  disableDoubleTapZoom,
  onOrientationChange,
  getOrientation,
  handleMobileKeyboard,
  enableSmoothScroll,
  hapticFeedback,
  addNotchSupport,
  isPWAInstalled,
  promptPWAInstall,
  scrollToElement,
  isLandscape,
  handleMobileFocus,
  initMobileOptimizations
};
