import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Forces the window to scroll to top on route changes.
 * Uses multiple methods to ensure reliable scrolling across all browsers.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run5',
        hypothesisId: 'C',
        location: 'src/components/navigation/ScrollToTop.tsx:useEffect',
        message: 'route change',
        data: { pathname },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Immediate scroll to top using multiple methods for maximum compatibility
    const scrollToTop = () => {
      // Method 1: Direct assignment (most reliable and immediate)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // Method 2: scrollTo with instant behavior
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch (e) {
        // Fallback for browsers that don't support 'instant'
        window.scrollTo(0, 0);
      }

      // Method 3: scrollIntoView on body/html
      if (document.documentElement) {
        try {
          document.documentElement.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
        } catch (e) {
          document.documentElement.scrollIntoView(true);
        }
      }
    };

    // Execute immediately
    scrollToTop();

    // Execute after render to catch any async content
    const timeoutId1 = setTimeout(scrollToTop, 0);
    const timeoutId2 = setTimeout(scrollToTop, 10);
    const timeoutId3 = setTimeout(scrollToTop, 50);

    // Cleanup
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [pathname]);

  // Also scroll to top on initial mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return null;
}


