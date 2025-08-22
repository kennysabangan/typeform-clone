import { motion } from "framer-motion";
import { useFormContext } from "../context/FormContextProvider";

const ProgressBar = () => {
  const { tab } = useFormContext();
  const progressPercentage = (tab / 11) * 100;

  return (
    <>
      {tab !== 0 && tab !== 12 ? (
        <motion.div
          className="progress-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="progress-bar--actual-progress"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.2,
            }}
          />

          {/* Progress indicator text */}
          <motion.div
            className="progress-bar__text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="progress-bar__step">Step {tab} of 11</span>
            <span className="progress-bar__percentage">
              {Math.round(progressPercentage)}%
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </>
  );
};

export default ProgressBar;
