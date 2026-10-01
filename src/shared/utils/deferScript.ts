import React from 'react';

/**
 * Utility to defer loading of non-critical scripts like analytics
 * This improves initial page load performance by loading scripts after page is interactive
 */

export const loadDeferredScript = (src: string, async = true, defer = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    // Check if script already exists
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.body.appendChild(script);
  });
};

/**
 * Load analytics scripts after page is interactive
 * Call this in useEffect after component mounts
 */
export const loadAnalytics = async () => {
  // Example: Load Google Analytics
  // await loadDeferredScript('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID');
  
  // Example: Load other analytics
  // await loadDeferredScript('https://cdn.example.com/analytics.js');
  
  console.log('Analytics scripts would be loaded here');
};

/**
 * Initialize analytics with configuration
 * Call this after scripts are loaded
 */
export const initializeAnalytics = (config: Record<string, any>) => {
  // Example: Initialize Google Analytics
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('js', new Date());
  //   (window as any).gtag('config', config.measurementId);
  // }
  
  console.log('Analytics would be initialized with:', config);
};

/**
 * React hook to load analytics after page is interactive
 */
export const useAnalytics = (config?: Record<string, any>) => {
  React.useEffect(() => {
    // Load analytics after a small delay to prioritize critical rendering
    const timer = setTimeout(async () => {
      try {
        await loadAnalytics();
        if (config) {
          initializeAnalytics(config);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [config]);
};
