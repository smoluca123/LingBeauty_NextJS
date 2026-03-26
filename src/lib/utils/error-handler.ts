import { HTTPError } from 'ky'

/**
 * Error handling utilities for API calls and error message extraction
 */

/**
 * Standardized error handler for client API functions
 * Extracts error message from HTTPError (backend response) or falls back to default message
 * @param error - The caught error (typically HTTPError from ky)
 * @param defaultMessage - Fallback message if backend doesn't provide one
 * @throws Error with extracted or default message
 * @example
 * ```ts
 * try {
 *   return await kyInstance.get('endpoint').json();
 * } catch (error) {
 *   return handleApiError(error, 'Failed to fetch data');
 * }
 * ```
 */
export const handleApiError = async (
  error: unknown,
  defaultMessage = 'An error occurred',
): Promise<never> => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}))
    const message =
      (data as { message?: string }).message || error.message || defaultMessage
    throw new Error(message)
  }

  // Re-throw non-HTTP errors as-is
  throw error
}

/**
 * Extracts a displayable error message from any thrown value
 * Useful for mutation onError handlers
 * @param error - The caught error
 * @param fallback - Fallback message if no message can be extracted
 * @returns A displayable error message string
 * @example
 * ```ts
 * onError: (error) => {
 *   toast.error(getErrorMessage(error, 'Operation failed'));
 * }
 * ```
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message || fallback
  if (typeof error === 'string') return error || fallback
  return fallback
}

/**
 * Safely extract error message from ky HTTPError response
 * Handles cases where response body is not JSON (e.g., plain text 500 errors)
 * @param error - The caught error
 * @param fallback - Fallback message if extraction fails
 * @returns Extracted error message or fallback
 * @example
 * ```ts
 * try {
 *   await kyInstance.get('endpoint').json();
 * } catch (error) {
 *   const message = await extractErrorMessage(error, 'Request failed');
 *   toast.error(message);
 * }
 * ```
 */
export async function extractErrorMessage(
  error: unknown,
  fallback: string,
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const errorData = await error.response.json()
      return errorData?.message || fallback
    } catch {
      // Response body is not JSON (e.g. plain-text 500 from Next.js)
      return error.message || fallback
    }
  }
  return (error as Error)?.message || fallback
}
