import { HTTPError } from 'ky'
import { NextResponse } from 'next/server'

/**
 * Wraps a server action for use in a Next.js proxy route handler.
 *
 * - On success: returns NextResponse with the result as JSON.
 * - On HTTPError: forwards the original BE error response (status + body) as-is.
 * - On unknown errors: returns a generic 500 response.
 *
 * This eliminates the need for repetitive try/catch in every proxy route.
 *
 * @example
 * export const PATCH = (req: Request) =>
 *   proxyRoute(() => updateMyInformationAPI(req.json()));
 */
export async function proxyRoute<T>(
  handlerFn: () => Promise<T>,
): Promise<NextResponse> {
  try {
    const result = await handlerFn()
    return NextResponse.json(result)
  } catch (error) {
    // Forward the exact BE error response (status code + body) to the client.
    // Use duck-typing instead of `instanceof HTTPError` to avoid module
    // bundling issues on Vercel where multiple ky instances can exist,
    // causing instanceof to silently return false.
    const isHttpError =
      error instanceof HTTPError ||
      (typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response: unknown }).response instanceof Response)

    if (isHttpError) {
      const httpError = error as HTTPError
      const errorBody = await httpError.response.json().catch(() => ({
        success: false,
        message: httpError.message,
      }))
      return NextResponse.json(errorBody, { status: httpError.response.status })
    }

    // Log unexpected (non-HTTP) errors to help diagnose production issues
    console.error('[proxyRoute] Unexpected error type:', {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      constructor: (error as object)?.constructor?.name,
    })

    // Fallback for unexpected errors (network errors, etc.)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    )
  }
}
