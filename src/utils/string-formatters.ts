// Takes a string and returns the word with the first letter capitalized
export const capitalizeFirstLetter = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);
