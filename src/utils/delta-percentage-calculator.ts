// Rounds to nearest whole number
// Returns 0 if no change was made
// Returns 100 if a change was made from a zero value
function deltaPercentageCalculator(
  previousValue: number,
  currentValue: number
) {
  // No change
  if (previousValue === currentValue) return 0;

  // 100% gain
  if (previousValue === 0) return 100;

  // 100% loss
  if (currentValue === 0) return -100;

  // Calculated changes
  const diff = currentValue - previousValue;
  return Math.round((diff / previousValue) * 100);
}

export default deltaPercentageCalculator;
