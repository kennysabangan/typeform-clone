import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

// Define the complete form data structure
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  goalFor1000: string;
  usState: string;
  creditScore: string;
  merchantAccount: string;
  debtCollections: string;
  utilityBill: string;
  phone: string;
  emailConsent: string;
  referral: string; // Q9: referral question
}

export interface ContextProps {
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  isReversed: boolean;
  setIsReversed: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  handleClickForward: (updatedFormData?: Partial<FormData>) => void;
  globalErrors: any;
  setGlobalErrors: any;
  clearFormData: () => void;
  submitFormData: () => Promise<void>;
}

export interface ProviderProps {
  children: JSX.Element;
}

const FormContext = createContext<ContextProps | {}>({});

// Constants for localStorage keys
const FORM_DATA_KEY = "el3vn_form_data";
const FORM_TAB_KEY = "el3vn_form_tab";

// Helper functions for localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;

    const parsed = JSON.parse(saved);
    // Additional validation for formData - should be an object, not array
    if (
      key === FORM_DATA_KEY &&
      (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    ) {
      console.warn("Invalid formData format in localStorage, using default");
      return defaultValue;
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

const FormContextProvider = ({ children }: ProviderProps) => {
  const [globalErrors, setGlobalErrors] = useState({});
  const isNavigatingRef = useRef(false);

  // Initialize form data with empty structure
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = loadFromLocalStorage(FORM_DATA_KEY, {
      firstName: "",
      lastName: "",
      email: "",
      goalFor1000: "",
      usState: "",
      creditScore: "",
      merchantAccount: "",
      debtCollections: "",
      utilityBill: "",
      phone: "",
      emailConsent: "",
      referral: "", // Q9: referral question
    });
    return savedData;
  });

  // Initialize tab from localStorage or 0
  const [tab, setTab] = useState(() => {
    const savedTab = loadFromLocalStorage(FORM_TAB_KEY, 0);

    // Show a brief notification if we're restoring progress
    if (savedTab > 0) {
      setTimeout(() => {
        console.log(
          "🔄 Progress restored! Continuing from where you left off..."
        );
      }, 100);
    }

    return savedTab;
  });

  const [isReversed, setIsReversed] = useState(false);

  // Function to update form data
  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(FORM_DATA_KEY, formData);
  }, [formData]);

  // Save tab to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(FORM_TAB_KEY, tab);
  }, [tab]);

  // Define required fields for each question
  const getRequiredFieldsForQuestion = (
    questionNumber: number
  ): (keyof FormData)[] => {
    switch (questionNumber) {
      case 1:
        return ["firstName", "lastName"];
      case 2:
        return ["email"];
      case 3:
        return ["goalFor1000"];
      case 4:
        return ["usState"];
      case 5:
        return ["creditScore"];
      case 6:
        return ["merchantAccount"];
      case 7:
        return ["debtCollections"];
      case 8:
        return ["utilityBill"];
      case 9:
        return ["referral"]; // Now required (will auto-fill "None" if empty)
      case 10:
        return ["phone"]; // Now required (will auto-fill "None" if empty)
      case 11:
        return ["emailConsent"];
      case 12:
        return []; // Results page
      default:
        return [];
    }
  };

  // Check if all required fields for a question are filled
  const isQuestionComplete = (questionNumber: number): boolean => {
    const requiredFields = getRequiredFieldsForQuestion(questionNumber);
    return requiredFields.every(
      (field) => formData[field] && formData[field].trim() !== ""
    );
  };

  // Find the first incomplete required question
  const findFirstIncompleteQuestion = (): number => {
    for (let i = 1; i <= 11; i++) {
      const requiredFields = getRequiredFieldsForQuestion(i);
      if (requiredFields.length > 0 && !isQuestionComplete(i)) {
        return i;
      }
    }
    return -1; // All required questions are complete
  };

  const handleClickForward = useCallback(
    (updatedFormData?: Partial<FormData>) => {
      // Prevent multiple rapid submissions
      if (isNavigatingRef.current) {
        console.log("Navigation blocked: already navigating");
        return;
      }

      isNavigatingRef.current = true;
      setIsReversed(false);

      // Use the updated form data if provided, otherwise use current form data
      const dataToCheck = updatedFormData
        ? { ...formData, ...updatedFormData }
        : formData;

      console.log("Current tab:", tab);
      console.log("Form data to check:", dataToCheck);
      console.log("Updated form data received:", updatedFormData);

      // Helper function to check if all required fields for a question are filled
      const isQuestionCompleteWithData = (
        questionNumber: number,
        data: FormData
      ): boolean => {
        const requiredFields = getRequiredFieldsForQuestion(questionNumber);
        const isComplete = requiredFields.every(
          (field) => data[field] && data[field].trim() !== ""
        );
        console.log(
          `Question ${questionNumber} required fields:`,
          requiredFields
        );
        console.log(
          `Question ${questionNumber} values:`,
          requiredFields.map(
            (field) =>
              `${field}: "${data[field]}" (type: ${typeof data[field]})`
          )
        );
        console.log(`Question ${questionNumber} complete:`, isComplete);
        return isComplete;
      };

      // Since all questions are now required, use simplified logic
      const findFirstIncompleteQuestionWithData = (data: FormData): number => {
        for (let i = 1; i <= 11; i++) {
          const requiredFields = getRequiredFieldsForQuestion(i);
          if (
            requiredFields.length > 0 &&
            !isQuestionCompleteWithData(i, data)
          ) {
            console.log(`First incomplete question found: ${i}`);
            return i;
          }
        }
        console.log("All required questions are complete");
        return -1; // All required questions are complete
      };

      const firstIncomplete = findFirstIncompleteQuestionWithData(dataToCheck);

      if (firstIncomplete !== -1) {
        // Go to the first incomplete required question
        console.log(`Navigating to incomplete question: ${firstIncomplete}`);
        setTab(firstIncomplete);
      } else {
        // All required questions are complete, proceed to next question or results
        const nextTab = tab + 1;
        console.log(`Proceeding to next tab: ${nextTab}`);
        setTab(nextTab > 11 ? 12 : nextTab);
      }

      // Reset navigation state immediately
      console.log("Resetting navigation state");
      isNavigatingRef.current = false;
    },
    [formData, tab]
  );

  // Function to clear all saved data (useful for form completion or reset)
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_KEY);
      localStorage.removeItem(FORM_TAB_KEY);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        goalFor1000: "",
        usState: "",
        creditScore: "",
        merchantAccount: "",
        debtCollections: "",
        utilityBill: "",
        phone: "",
        emailConsent: "",
        referral: "", // Q9: referral question
      });
      setTab(0);
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }, []);

  // Clean up corrupted data on initialization
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(FORM_DATA_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // FormData should be an object, not array
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          console.warn("Corrupted form data detected, clearing localStorage");
          clearFormData();
        }
      }
    } catch (error) {
      console.warn("Error validating localStorage data, clearing:", error);
      clearFormData();
    }
  }, [clearFormData]);

  // Submit form data to webhook
  const submitFormData = useCallback(async (): Promise<void> => {
    try {
      console.log("Submitting form data:", formData);
      console.log(
        "Webhook URL: https://scalesolving.app.n8n.cloud/webhook/0d895cef-4a07-4d11-a0f4-75e94f2d71a6"
      );

      const response = await fetch(
        "https://scalesolving.app.n8n.cloud/webhook/0d895cef-4a07-4d11-a0f4-75e94f2d71a6",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error text:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.text();
      console.log("Form data submitted successfully. Response:", responseData);
    } catch (error) {
      console.error("Error submitting form data:", error);

      // Log specific error types for debugging
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error("Network error - likely CORS or connectivity issue");
      }

      // Don't throw error to prevent blocking the UI
    }
  }, [formData]);

  return (
    <FormContext.Provider
      value={{
        tab,
        setTab,
        isReversed,
        setIsReversed,
        formData,
        updateFormData,
        handleClickForward,
        globalErrors,
        setGlobalErrors,
        clearFormData,
        submitFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormContextProvider;

export const useFormContext = () => useContext(FormContext) as ContextProps;
