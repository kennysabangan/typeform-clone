import { motion } from "framer-motion";
import { useFormContext } from "../context/FormContextProvider";

const StartOverButton = () => {
  const { tab, clearFormData, setTab } = useFormContext();

  // Don't show the button on the home page (tab 0)
  if (tab === 0) return null;

  const handleStartOver = () => {
    clearFormData();
    setTab(0);
  };

  return (
    <motion.button
      className="start-over-button"
      onClick={handleStartOver}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
      <span>Start Over</span>
    </motion.button>
  );
};

export default StartOverButton;
