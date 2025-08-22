export const Qvariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      duration: 0.4
    }
  },
};

export const reverseVariants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      duration: 0.6
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      duration: 0.4
    }
  },
};

// Enhanced page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      duration: 0.8
    }
  },
  exit: {
    opacity: 0,
    scale: 1.2,
    filter: 'blur(10px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      duration: 0.5
    }
  }
};

// Stagger animation for form elements
export const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  }
};
