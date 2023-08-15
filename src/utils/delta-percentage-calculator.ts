// Rounds to nearest whole number
// Returns 0 if no change was made
// Returns 100 if a change was made from a zero value
function deltaPercentageCalculator(
  previousValue: number,
  currentValue: number
) {
  if (previousValue === currentValue) return 0;
  if (previousValue === 0) return 100;
  return Math.round((currentValue / previousValue) * 100);
}

export default deltaPercentageCalculator;
