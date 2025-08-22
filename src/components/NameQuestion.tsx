import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useFormContext } from "../context/FormContextProvider";
import {
  Qvariants,
  reverseVariants,
  containerVariants,
  itemVariants,
} from "../data/variants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Arrow from "./ui/Arrow";
import Tick from "./ui/Tick";
import ErrorImg from "../assets/ErrorImg";

interface Props {
  number: number;
  question: string;
}

// Schema for first name and last name
const nameSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const NameQuestion = ({ number, question }: Props) => {
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
  } = useForm<{ firstName: string; lastName: string }>({
    mode: "onSubmit",
    resolver: yupResolver(nameSchema),
  });

  useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  const onSubmit = (data: { firstName: string; lastName: string }) => {
    // Update the form data with the new values
    updateFormData("firstName", data.firstName);
    updateFormData("lastName", data.lastName);
    // Pass the updated data directly to handleClickForward to avoid race condition
    handleClickForward({
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  // Get default values from form data
  const defaultFirstName = formData.firstName;
  const defaultLastName = formData.lastName;

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
        </motion.div>

        <motion.form onSubmit={handleSubmit(onSubmit)} variants={itemVariants}>
          <div className="name-inputs">
            <div className="input-wrapper">
              <input
                {...register("firstName")}
                defaultValue={defaultFirstName}
                className="input"
                placeholder="First name"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="error-para"
                >
                  <ErrorImg />
                  <span>{errors.firstName?.message}</span>
                </motion.div>
              )}
            </div>

            <div className="input-wrapper">
              <input
                {...register("lastName")}
                defaultValue={defaultLastName}
                className="input"
                placeholder="Last name"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="error-para"
                >
                  <ErrorImg />
                  <span>{errors.lastName?.message}</span>
                </motion.div>
              )}
            </div>
          </div>

          <motion.div className="button--wrapper" variants={itemVariants}>
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
            <p className="button__helper">
              <kbd>Enter ↵</kbd> to continue
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.main>
  );
};

export default NameQuestion;
