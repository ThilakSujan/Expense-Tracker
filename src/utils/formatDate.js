/**
 * Formats date string to readable format
 * @param {string} dateStr
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
