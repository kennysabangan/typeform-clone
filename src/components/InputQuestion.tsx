import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useFormContext, FormData } from "../context/FormContextProvider";
import {
  Qvariants,
  reverseVariants,
  containerVariants,
  itemVariants,
} from "../data/variants";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaSelector } from "../data/schema";

import Arrow from "./ui/Arrow";
import Tick from "./ui/Tick";
import ErrorImg from "../assets/ErrorImg";

interface Props {
  number: number;
  question: string;
  subtitle?: string;
  showSkipButton?: boolean;
}

const InputQuestion = ({
  number,
  question,
  subtitle,
  showSkipButton = false,
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { formData, updateFormData, isReversed, tab, handleClickForward } =
    useFormContext();

  const keyHandler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keypress", (e) => keyHandler(e));

    return () => document.removeEventListener("keypress", (e) => keyHandler(e));
  }, [keyHandler]);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Record<string, string>>({
    mode: "onSubmit",
    resolver: yupResolver(schemaSelector(tab)),
  });

  useEffect(() => {
    setFocus(`Q${number}`);
  }, [number, setFocus]);

  // Map question numbers to form data fields
  const getFieldForQuestion = (
    questionNumber: number
  ): keyof FormData | null => {
    switch (questionNumber) {
      case 2:
        return "email";
      case 10:
        return "phone";
      default:
        return null;
    }
  };

  // Map question numbers to autocomplete attributes
  const getAutocompleteForQuestion = (questionNumber: number): string => {
    switch (questionNumber) {
      case 2:
        return "email";
      case 10:
        return "tel";
      default:
        return "off";
    }
  };

  const onSubmit = (data: Record<string, string>) => {
    const field = getFieldForQuestion(number);
    if (field) {
      let value = data[`Q${number}`] || "";

      // Auto-fill "None" for optional questions (10) if empty
      if (number === 10 && (!value || value.trim() === "")) {
        value = "None";
      }

      updateFormData(field, value);
      // Pass the updated data directly to handleClickForward to avoid race condition
      handleClickForward({ [field]: value });
    } else {
      handleClickForward();
    }
  };

  const handleSkip = () => {
    // Skip without updating form data, just move forward
    handleClickForward();
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
          <div className="input-wrapper">
            <input
              {...register(`Q${number}`)}
              defaultValue={(() => {
                const field = getFieldForQuestion(number);
                return field ? formData[field] : "";
              })()}
              className="input"
              placeholder="Type your answer here..."
              autoComplete={getAutocompleteForQuestion(number)}
            />
          </div>

          {errors[`Q${number}`] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="error-para"
            >
              <ErrorImg />
              <span>{errors[`Q${number}`]?.message}</span>
            </motion.div>
          )}

          <motion.div className="button--wrapper" variants={itemVariants}>
            {showSkipButton ? (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  type="submit"
                  ref={buttonRef}
                  className="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Continue</span>
                  <Tick />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSkip}
                  className="button button--secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Skip</span>
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="submit"
                ref={buttonRef}
                className="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Continue</span>
                <Tick />
              </motion.button>
            )}
            <p className="button__helper">
              <kbd>Enter ↵</kbd> to continue
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.main>
  );
};

export default InputQuestion;
