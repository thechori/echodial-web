import { AxiosError } from "axios";

/**
 *
 * @param error Generic error object
 * @param message Optional message that can be passed in to override default message
 * @returns Error message to show user
 */
export const extractErrorMessage = (
  error: unknown,
  message = "There was an error. Please try again later"
) => {
  // Handle nothing
  if (error === null || error === undefined) return null;

  // Axios errors
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.response?.data || message;
  }
  // RTK Query errors
  if (error && typeof error === "object" && "data" in error) {
    // @ts-ignore
    if ("message" in error.data) {
      return error.data.message;
    }
    return error.data;
  }

  // Generic TypeScript/JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Default
  return message;
};
