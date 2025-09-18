// Fix for viewport height issues on mobile devices
// Just capture initial height and set max-height

export const setViewportHeight = () => {
  // Get the initial viewport height
  const initialHeight = window.innerHeight;

  // Set it as a CSS custom property for max-height
  document.documentElement.style.setProperty('--max-vh', `${initialHeight}px`);

  return () => {
    // No cleanup needed
  };
};
