import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import homeImg from "../assets/home.webp";
import { useFormContext } from "../context/FormContextProvider";
import {
  pageVariants,
  containerVariants,
  itemVariants,
} from "../data/variants";

const Home = () => {
  const { setTab, tab, formData } = useFormContext();
  const [showProgressRestored, setShowProgressRestored] = useState(false);

  // Show progress restored message if we have saved data
  useEffect(() => {
    // Check if any form fields have data
    const hasFormData = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (tab > 0 && hasFormData) {
      setShowProgressRestored(true);
      const timer = setTimeout(() => {
        setShowProgressRestored(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [tab, formData]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", (e) => keyHandler(e));

    return () => document.removeEventListener("keypress", (e) => keyHandler(e));
  }, [keyHandler]);

  return (
    <motion.main
      className="home"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {showProgressRestored && (
        <motion.div
          className="progress-restored-notification"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="notification-content">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Progress restored! You can continue where you left off.</span>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="home__content"
      >
        <motion.figure
          className="home__img--wrapper"
          variants={itemVariants}
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={homeImg} className="home__img" alt="EL3VN Logo" />
        </motion.figure>

        <motion.div variants={itemVariants} className="home__text">
          <h1 className="title">Get Started with EL3VN</h1>
          <p className="home__subtitle">
            There are hard requirements for the program. If you qualify, set up
            a time for an Intro Call that works for you. This is not a sales
            call. We’ll confirm a few basic questions, show you how the program
            works and answer any questions you may have.
          </p>
        </motion.div>

        <motion.div className="button--wrapper" variants={itemVariants}>
          <motion.button
            ref={buttonRef}
            className="button"
            onClick={() => setTab((state) => state + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>Get Started</span>
            <svg
              width="16"
              height="16"
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
          <motion.p className="button__helper" variants={itemVariants}>
            <kbd>Enter ↵</kbd> to begin
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default Home;
