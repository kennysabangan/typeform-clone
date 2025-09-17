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

interface Props {
  number: number;
  question: string | React.ReactNode;
  subtitle?: string;
  buttonText?: string;
}

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const SelectQuestion = ({
  number,
  question,
  subtitle,
  buttonText = "Continue",
}: Props) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [filteredStates, setFilteredStates] = useState(US_STATES);
  const [searchTerm, setSearchTerm] = useState("");

  const { formData, updateFormData, isReversed, handleClickForward } =
    useFormContext();

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isOpen) {
        buttonRef.current?.click();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keypress", (e) => keyHandler(e));
    document.addEventListener("keydown", (e) => keyHandler(e));

    return () => {
      document.removeEventListener("keypress", (e) => keyHandler(e));
      document.removeEventListener("keydown", (e) => keyHandler(e));
    };
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
      case 4:
        return "usState";
      default:
        return null;
    }
  };

  // Map question numbers to autocomplete attributes
  const getAutocompleteForQuestion = (questionNumber: number): string => {
    switch (questionNumber) {
      default:
        return "off";
    }
  };

  // Load existing data
  useEffect(() => {
    const field = getFieldForQuestion(number);
    if (field && formData[field]) {
      setSelectedState(formData[field]);
      setValue(`Q${number}`, formData[field]);
    }
  }, [formData, number, setValue]);

  // Filter states based on search
  useEffect(() => {
    if (searchTerm) {
      setFilteredStates(
        US_STATES.filter((state) =>
          state.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStates(US_STATES);
    }
  }, [searchTerm]);

  const onSubmit = (data: Record<string, string>) => {
    const field = getFieldForQuestion(number);
    if (field) {
      const value = data[`Q${number}`] || selectedState;
      updateFormData(field, value);
      // Pass the updated data directly to handleClickForward to avoid race condition
      handleClickForward({ [field]: value });
    } else {
      handleClickForward();
    }
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setValue(`Q${number}`, state);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
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
          <div className="select-wrapper">
            <input
              {...register(`Q${number}`)}
              type="text"
              value={selectedState || searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsOpen(true)}
              className="select-input"
              placeholder="Type or select an option"
              autoComplete={getAutocompleteForQuestion(number)}
              inputMode="none"
            />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="select-dropdown-button"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`select-arrow ${isOpen ? "select-arrow--open" : ""}`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="select-dropdown"
              >
                <div className="select-options">
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => handleStateSelect(state)}
                      className={`select-option ${
                        selectedState === state ? "select-option--selected" : ""
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                  {filteredStates.length === 0 && (
                    <div className="select-no-results">No states found</div>
                  )}
                </div>
                <div className="select-footer">
                  <span className="select-count">
                    {filteredStates.length} options in list
                  </span>
                </div>
              </motion.div>
            )}
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
              disabled={!selectedState}
            >
              {buttonText}
            </button>
            <p className="button__helper">
              <kbd>Enter</kbd> ↵
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.main>
  );
};

export default SelectQuestion;
