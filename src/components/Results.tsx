import { motion } from "framer-motion";
import { useEffect } from "react";
import { useFormContext } from "../context/FormContextProvider";
import {
  pageVariants,
  containerVariants,
  itemVariants,
} from "../data/variants";

const Results = ({ resultPara }: { resultPara: string }) => {
  const { formData, setTab } = useFormContext();
  console.log(formData);

  // Load Calendly script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Note: Form data is NOT automatically cleared to allow testing resubmission
  // Data is only cleared when user explicitly clicks "Start Over"

  return (
    <motion.div
      className="results"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="results__content"
      >
        <div className="results__layout">
          <motion.div variants={itemVariants} className="results__text-column">
            <h1 className="results__title">
              <span className="results__title-text">
                Thank you,{" "}
                {formData.firstName ? (
                  <span className="question__highlight">
                    {formData.firstName}
                  </span>
                ) : (
                  <span className="question__highlight">there</span>
                )}
                !
              </span>
              {/* Test button positioned inline with name */}
              <motion.button
                className="button test-button-inline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Go back to Question 11 for testing without clearing data
                  setTab(11);
                }}
                style={{
                  backgroundColor: "#10b981",
                  borderColor: "#10b981",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                  verticalAlign: "middle",
                }}
              >
                <span>🧪 Test Resubmit</span>
              </motion.button>
            </h1>

            <div className="results__description">
              <p className="result__para">
                The next step is to schedule a 20-minute Intro Call so we can
                get you information on getting started on earning up to{" "}
                <strong>$1,000 / month in Passive Income!</strong>
              </p>
            </div>
          </motion.div>

          <div className="results__calendly-column">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/el3vn-team/el3vn-intro-call-20-min?hide_event_type_details=1&hide_gdpr_banner=1"
              style={{
                minWidth: "500px",
                minHeight: "620px",
              }}
            ></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Results;
