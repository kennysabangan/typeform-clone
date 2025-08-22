import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useFormContext } from "../context/FormContextProvider";

const Navigation = () => {
  const leftButton = useRef<HTMLButtonElement | null>(null);
  const rightButton = useRef<HTMLButtonElement | null>(null);

  const { setIsReversed, tab, setTab, handleClickForward } = useFormContext();

  const handleClickBack = () => {
    setIsReversed(true);
    setTab((state) => state - 1);
  };

  const handleClickForwardNav = () => {
    handleClickForward(); // Call without any updated form data
  };

  const navigationVariants = {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {tab !== 0 && tab !== 12 && (
        <motion.div
          className="navigation"
          variants={navigationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.button
            ref={leftButton}
            className="nav__button nav__button--left"
            disabled={tab === 1}
            onClick={handleClickBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Previous question"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          <motion.button
            ref={rightButton}
            className="nav__button nav__button--right"
            disabled={tab === 11}
            onClick={handleClickForwardNav}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Next question"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
