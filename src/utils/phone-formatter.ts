/**
 * Takes the raw, Twilio compliant phone number from the DB and formats it into a human-readable format
 * @param number Twilio-compliant phone number (string)
 * @returns Human readable string
 */
function phoneFormatter(number: string | null | undefined) {
  // Handle undefined
  if (!number) return null;

  // Remove all non-numeric characters from the input phone number
  const numericOnly = number.replace(/\D/g, "");

  // Check if the numericOnly string has 11 digits (valid USA phone number will lead with "1")
  if (numericOnly.length !== 11) {
    console.error(
      "Invalid USA-based phone number. Please provide a 10-digit number"
    );
    return number;
  }

  // Extract area code, prefix, and line number
  const areaCode = numericOnly.slice(1, 4);
  const prefix = numericOnly.slice(4, 7);
  const lineNumber = numericOnly.slice(7);

  // Format the phone number in the desired human-readable format
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

export default phoneFormatter;
