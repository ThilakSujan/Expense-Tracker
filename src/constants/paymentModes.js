export const PAYMENT_MODES = [
  "UPI",
  "Cash",
  "Debit Card",
  "Credit Card",
  "Net Banking",
  "Cheque",
  "Other",
];

export const getPaymentModeIcon = (mode) => {
  switch (mode) {
    case "UPI":
      return "📱";
    case "Cash":
      return "💵";
    case "Debit Card":
    case "Credit Card":
      return "💳";
    case "Net Banking":
      return "🌐";
    case "Cheque":
      return "📝";
    default:
      return "⚡";
  }
};

