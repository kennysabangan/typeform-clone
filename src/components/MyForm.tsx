import React from "react";
import Navigation from "./Navigation";
import { useFormContext } from "../context/FormContextProvider";
import { AnimatePresence } from "framer-motion";
import Home from "./Home";
import InputQuestion from "./InputQuestion";
import NameQuestion from "./NameQuestion";
import TextAreaQuestion from "./TextAreaQuestion";
import SelectQuestion from "./SelectQuestion";
import RadioQuestion from "./RadioQuestion";
import Results from "./Results";
import ProgressBar from "./ProgressBar";
import StartOverButton from "./StartOverButton";

const MyForm = () => {
  const { tab, formData } = useFormContext();
  const pages = [
    { number: 0, page: <Home key={0} /> },
    {
      number: 1,
      page: (
        <NameQuestion
          number={1}
          question={`Let's get started. What is your name?`}
          key={1}
        />
      ),
    },
    {
      number: 2,
      page: (
        <InputQuestion
          number={2}
          question={`Thanks ${
            formData.firstName ? formData.firstName : ""
          }. What's your email address?`}
          key={2}
        />
      ),
    },
    {
      number: 3,
      page: (
        <TextAreaQuestion
          number={3}
          question={
            <>
              What do you want to use the{" "}
              <span className="question__highlight">$1,000 a month</span> for? *
            </>
          }
          subtitle="Describe your principle goal."
          buttonText="Continue"
          key={3}
        />
      ),
    },
    {
      number: 4,
      page: (
        <SelectQuestion
          number={4}
          question={
            <>
              In which <span className="question__highlight">U.S. State</span>{" "}
              is your Legal Residence? *
            </>
          }
          subtitle="The EL3VN Program does not require any upfront investment. However, for individuals residing in certain states, there may be additional fees that exceed our standard reimbursement."
          key={4}
        />
      ),
    },
    {
      number: 5,
      page: (
        <RadioQuestion
          number={5}
          question={
            <>
              About where is your{" "}
              <span className="question__highlight">Credit Score</span> today? *
            </>
          }
          options={["Over 680", "Around 620-680", "Under 620"]}
          key={5}
        />
      ),
    },
    {
      number: 6,
      page: (
        <RadioQuestion
          number={6}
          question={
            <>
              Do you have a{" "}
              <span className="question__highlight">
                Merchant Processing Account
              </span>
              ? *
            </>
          }
          subtitle="A formal account that lets your business accept credit/debit cards directly. Stripe, Shopify, Wix, PayPal don't count."
          options={["Yes", "No"]}
          key={6}
        />
      ),
    },
    {
      number: 7,
      page: (
        <RadioQuestion
          number={7}
          question={
            <>
              Do you have any{" "}
              <span className="question__highlight">
                Active Debt Collections, Judgments, Liens
              </span>{" "}
              or are you on{" "}
              <span className="question__highlight">Government Assistance</span>
              ? *
            </>
          }
          subtitle="(Welfare, Food Stamps, etc.)"
          options={["Yes", "No"]}
          key={7}
        />
      ),
    },
    {
      number: 8,
      page: (
        <RadioQuestion
          number={8}
          question={
            <>
              Do you have a{" "}
              <span className="question__highlight">Utility Bill</span>{" "}
              <em>(or similar)</em> that matches your place of residence shown
              on your{" "}
              <span className="question__highlight">Driver's License</span>? *
            </>
          }
          subtitle="(Electric, Phone Bill, Renters Insurance, Lease Agreement, Voter Registration)"
          options={["Yes", "No"]}
          key={8}
        />
      ),
    },
    {
      number: 9,
      page: (
        <TextAreaQuestion
          number={9}
          question={`Who referred you to EL3VN?`}
          subtitle="Hit Continue to SKIP"
          buttonText={"Continue"}
          helperText={"Enter"}
          key={9}
        />
      ),
    },
    {
      number: 10,
      page: (
        <InputQuestion
          number={10}
          question={`Lastly, what's your Phone Number?`}
          subtitle="By providing your phone number, you consent to receive communications via call or text."
          key={10}
        />
      ),
    },
    {
      number: 11,
      page: (
        <RadioQuestion
          number={11}
          question={
            <>
              Do you consent to receive communications via{" "}
              <span className="question__highlight">Email</span>? *
            </>
          }
          subtitle="We do not sell your data. We'll be sending information regarding the program."
          options={["Yes", "No"]}
          buttonText="Submit and Complete"
          key={11}
        />
      ),
    },
    {
      number: 12,
      page: (
        <Results
          resultPara={`Thank you for taking the time to complete your application${
            formData.firstName ? `, ${formData.firstName}` : ""
          }. We've received your information and will review it carefully. You can expect to hear back from us within the next few business days.`}
          key={12}
        />
      ),
    },
  ];

  return (
    <div className="container">
      <ProgressBar />
      <StartOverButton />
      <Navigation />
      <AnimatePresence exitBeforeEnter={true}>
        {pages.map((item) => {
          if (tab === Number(item.number)) {
            return item.page;
          } else return null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default MyForm;
