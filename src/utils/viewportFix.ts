// Fix for viewport height issues on mobile devices
// Ensures the app stays within the initial viewport height

export const setViewportHeight = () => {
  // Get the initial viewport height
  const initialViewportHeight = window.innerHeight;

  // Set CSS custom property with the initial height
  document.documentElement.style.setProperty('--initial-vh', `${initialViewportHeight}px`);

  // Update on resize (but only if the height increases, not decreases)
  // This prevents the height from shrinking when keyboard disappears
  let maxHeight = initialViewportHeight;

  const updateViewportHeight = () => {
    const currentHeight = window.innerHeight;
    if (currentHeight > maxHeight) {
      maxHeight = currentHeight;
      document.documentElement.style.setProperty('--initial-vh', `${maxHeight}px`);
    }
  };

  window.addEventListener('resize', updateViewportHeight);
  window.addEventListener('orientationchange', updateViewportHeight);

  return () => {
    window.removeEventListener('resize', updateViewportHeight);
    window.removeEventListener('orientationchange', updateViewportHeight);
  };
};

// Alternative approach: Use the visual viewport API if available
export const useVisualViewport = () => {
  if (window.visualViewport) {
    const updateHeight = () => {
      const height = window.visualViewport!.height;
      document.documentElement.style.setProperty('--viewport-height', `${height}px`);
    };

    window.visualViewport.addEventListener('resize', updateHeight);
    updateHeight(); // Set initial value

    return () => {
      window.visualViewport!.removeEventListener('resize', updateHeight);
    };
  }

  // Fallback to regular viewport
  return setViewportHeight();
};
