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
    console.log("RTK Query error");
    // TODO: Fix bug here -- caused an app crash when DB connection timed out during
    // initial dashboard load

    // TODO: FIX ME - very brittle, works for now to get import modal working again
    // @ts-ignore
    return error?.data?.message || error.data;
  }

  // Generic TypeScript/JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Default
  return message;
};
