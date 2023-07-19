import { AxiosError } from "axios";

/**
 *
 * @param error Generic error object
 * @param message Optional message that can be passed in to override default message
 * @returns Error message to show user
 */
export const extractErrorMessage = (
  error: unknown,
  message = "There was an error. Please try again later."
) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || message;
  }
  if (error instanceof Error) {
    return error.message;
  }

  return message;
};
