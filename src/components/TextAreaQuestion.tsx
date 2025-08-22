import { useCallback, useEffect, useRef } from "react";
import { useFormContext, FormData } from "../context/FormContextProvider";
import Arrow from "./ui/Arrow";
import Tick from "./ui/Tick";
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

interface Props {
  number: number;
  question: string | React.ReactNode;
  subtitle?: string;
  buttonText?: string;
  helperText?: string;
}

const TextAreaQuestion = ({
  number,
  question,
  subtitle,
  buttonText = "Continue",
  helperText = "Enter ↵",
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { formData, updateFormData, isReversed, handleClickForward } =
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
    resolver: yupResolver(schemaSelector(number)),
  });

  useEffect(() => {
    setFocus(`Q${number}`);
  }, [number, setFocus]);

  // Map question numbers to form data fields
  const getFieldForQuestion = (
    questionNumber: number
  ): keyof FormData | null => {
    switch (questionNumber) {
      case 3:
        return "goalFor1000";
      case 9:
        return "referral"; // referral question
      default:
        return null;
    }
  };

  const onSubmit = (data: Record<string, string>) => {
    const field = getFieldForQuestion(number);
    if (field) {
      let value = data[`Q${number}`] || "";

      // Auto-fill "None" for optional questions (9) if empty
      if (number === 9 && (!value || value.trim() === "")) {
        value = "None";
      }

      updateFormData(field, value);
      // Pass the updated data directly to handleClickForward to avoid race condition
      handleClickForward({ [field]: value });
    } else {
      handleClickForward();
    }
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
              autoComplete="off"
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
            <motion.button
              type="submit"
              ref={buttonRef}
              className="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{buttonText}</span>
              <Tick />
            </motion.button>
            <p className="button__helper">
              <kbd>{helperText}</kbd> to continue
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.main>
  );
};

export default TextAreaQuestion;
