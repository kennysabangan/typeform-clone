export interface WarningTrigger {
  questionNumber: number;
  triggerAnswers: string[];
  title: string;
  message: string;
}

export const warningTriggers: WarningTrigger[] = [
  {
    questionNumber: 5, // Credit Score
    triggerAnswers: ["Under 620"],
    title: "Credit Score Requirement",
    message: "This question is a strict requirement by the bank. A credit score under 620 may affect your ability to join the program. Please acknowledge that this may impact your eligibility."
  },
  {
    questionNumber: 6, // Merchant Processing Account
    triggerAnswers: ["Yes"],
    title: "Merchant Account Requirement",
    message: "This question is a strict requirement by the bank. Not having a Merchant Processing Account may affect your ability to join the program. Please acknowledge that this may impact your eligibility."
  },
  {
    questionNumber: 7, // Debt Collections
    triggerAnswers: ["Yes"],
    title: "Financial Standing Requirement",
    message: "This question is a strict requirement by the bank. Having active debt collections, judgments, liens, or being on government assistance may affect your ability to join the program. Please acknowledge that this may impact your eligibility."
  },
  {
    questionNumber: 8, // Utility Bill
    triggerAnswers: ["No"],
    title: "Address Verification Requirement",
    message: "This question is a strict requirement by the bank. Not having proper address verification documentation may affect your ability to join the program. Please acknowledge that this may impact your eligibility."
  }
];

export const getWarningForAnswer = (questionNumber: number, answer: string): WarningTrigger | null => {
  const trigger = warningTriggers.find(
    (trigger) =>
      trigger.questionNumber === questionNumber &&
      trigger.triggerAnswers.includes(answer)
  );

  return trigger || null;
};
