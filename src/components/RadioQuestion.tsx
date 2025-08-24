import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, FormData } from "../context/FormContextProvider";
import Arrow from "./ui/Arrow";
import { motion } from "framer-motion";
import {
  Qvariants,
  reverseVariants,
  containerVariants,
  itemVariants,
} from "../data/variants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaSelector } from "../data/schema";
import ErrorImg from "../assets/ErrorImg";
import WarningModal from "./WarningModal";
import { getWarningForAnswer } from "../utils/warningTriggers";

interface Props {
  number: number;
  question: string | React.ReactNode;
  subtitle?: string;
  options: string[];
  buttonText?: string;
}

const RadioQuestion = ({
  number,
  question,
  subtitle,
  options,
  buttonText = "Continue",
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<string | null>(
    null
  );

  const {
    formData,
    updateFormData,
    isReversed,
    handleClickForward,
    submitFormData,
  } = useFormContext();

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedOption) {
        buttonRef.current?.click();
      }
    },
    [selectedOption]
  );

  useEffect(() => {
    document.addEventListener("keypress", (e) => keyHandler(e));

    return () => document.removeEventListener("keypress", (e) => keyHandler(e));
  }, [keyHandler]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Record<string, string>>({
    mode: "onSubmit",
    resolver: yupResolver(schemaSelector(number)),
  });

  // Get the field for this question
  const getFieldForQuestion = (
    questionNumber: number
  ): keyof FormData | null => {
    switch (questionNumber) {
      case 5:
        return "creditScore";
      case 6:
        return "merchantAccount";
      case 7:
        return "debtCollections";
      case 8:
        return "utilityBill";
      case 11:
        return "emailConsent";
      default:
        return null;
    }
  };

  // Load existing data
  useEffect(() => {
    const field = getFieldForQuestion(number);
    if (field && formData[field]) {
      setSelectedOption(formData[field]);
      setValue(`Q${number}`, formData[field]);
    }
  }, [formData, number, setValue]);

  const onSubmit = async (data: Record<string, string>) => {
    const field = getFieldForQuestion(number);
    if (field) {
      const value = data[`Q${number}`] || selectedOption;
      console.log(
        `Question ${number}: Submitting field "${field}" with value "${value}"`
      );

      // Check if this answer triggers a warning
      const warningTrigger = getWarningForAnswer(number, value);

      if (warningTrigger) {
        // Show warning modal and store the pending submission
        setPendingSubmission(value);
        setShowWarningModal(true);
        return;
      }

      // Proceed with normal submission
      await proceedWithSubmission(value);
    } else {
      console.log(
        `Question ${number}: No field mapping found, proceeding anyway`
      );
      handleClickForward();
    }
  };

  const proceedWithSubmission = async (value: string) => {
    const field = getFieldForQuestion(number);
    if (field) {
      updateFormData(field, value);

      // For Question 11 (final submission), send webhook before proceeding
      if (number === 11) {
        console.log("Final submission - sending webhook");
        await submitFormData();
      }

      // Pass the updated data directly to handleClickForward to avoid race condition
      handleClickForward({ [field]: value });
    }
  };

  const handleWarningContinue = async () => {
    setShowWarningModal(false);
    if (pendingSubmission) {
      await proceedWithSubmission(pendingSubmission);
      setPendingSubmission(null);
    }
  };

  const handleWarningClose = () => {
    setShowWarningModal(false);
    setPendingSubmission(null);
    // User can change their answer
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setValue(`Q${number}`, option);
  };

  return (
    <motion.main
      className="question"
      variants={isReversed ? reverseVariants : Qvariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={itemVariants} className="question__header">
          <div className="question__number">
            <span>{number}</span>
            <Arrow />
          </div>
          <h1 className="title">{question}</h1>
          {subtitle && <p className="question__subtitle">{subtitle}</p>}
        </motion.div>

        <motion.form onSubmit={handleSubmit(onSubmit)} variants={itemVariants}>
          <input
            {...register(`Q${number}`)}
            type="hidden"
            value={selectedOption}
          />

          <div className="radio-options">
            {options.map((option, index) => (
              <motion.button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`radio-option ${
                  selectedOption === option ? "radio-option--selected" : ""
                }`}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <div className="radio-option__indicator">
                  {selectedOption === option && (
                    <motion.div
                      className="radio-option__dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    />
                  )}
                </div>
                <span className="radio-option__text">{option}</span>
              </motion.button>
            ))}
          </div>

          {errors[`Q${number}`] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error"
            >
              <ErrorImg />
              <span>{errors[`Q${number}`]?.message}</span>
            </motion.div>
          )}

          <motion.div className="button--wrapper" variants={itemVariants}>
            <button
              ref={buttonRef}
              className="button"
              type="submit"
              disabled={!selectedOption}
            >
              {buttonText}
            </button>
            <p className="button__helper">
              <kbd>Enter</kbd> ↵
            </p>
          </motion.div>
        </motion.form>
      </motion.div>

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={handleWarningClose}
        onContinue={handleWarningContinue}
        title={
          getWarningForAnswer(number, pendingSubmission || "")?.title || ""
        }
        message={
          getWarningForAnswer(number, pendingSubmission || "")?.message || ""
        }
      />
    </motion.main>
  );
};

export default RadioQuestion;
