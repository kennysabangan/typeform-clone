import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  title: string;
  message: string;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  title,
  message,
}) => {
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="warning-modal-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="warning-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="warning-modal__header">
              <div className="warning-modal__icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="warning-modal__title">{title}</h2>
            </div>

            <div className="warning-modal__content">
              <p className="warning-modal__message">{message}</p>
            </div>

            <div className="warning-modal__actions">
              <button
                className="warning-modal__button warning-modal__button--secondary"
                onClick={onClose}
              >
                Go Back & Change Answer
              </button>
              <button
                className="warning-modal__button warning-modal__button--primary"
                onClick={onContinue}
              >
                Continue Anyway
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;
