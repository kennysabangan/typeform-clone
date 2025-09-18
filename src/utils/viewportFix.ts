// Fix for viewport height issues on mobile devices
// Ensures the app stays within the initial viewport height

export const setViewportHeight = () => {
  // Set initial viewport height immediately
  const setInitialHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Also set the full height
    const fullHeight = window.innerHeight;
    document.documentElement.style.setProperty('--initial-vh', `${fullHeight}px`);
  };

  // Set initial height
  setInitialHeight();

  // For iOS Safari, we need to handle this differently
  // Only update the height if the window actually resized (not just keyboard)
  let initialHeight = window.innerHeight;
  let timeoutId: number;

  const handleResize = () => {
    // Clear any existing timeout
    clearTimeout(timeoutId);

    // Debounce the resize event
    timeoutId = window.setTimeout(() => {
      const currentHeight = window.innerHeight;

      // Only update if the height increased significantly (orientation change)
      // Don't update for keyboard showing/hiding
      if (currentHeight > initialHeight * 1.1) {
        initialHeight = currentHeight;
        setInitialHeight();
      }
    }, 150);
  };

  // Handle orientation changes properly
  const handleOrientationChange = () => {
    // Wait for the orientation change to complete
    setTimeout(() => {
      initialHeight = window.innerHeight;
      setInitialHeight();
    }, 500);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientationChange);

  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};
