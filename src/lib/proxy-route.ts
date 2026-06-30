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
    // Forward the exact BE error response (status code + body) to the client
    // console.log(error)
    if (error instanceof HTTPError) {
      const errorBody = await error.response
        .clone()
        .json()
        .catch(() => ({
          success: false,
          message: error.message,
        }))
      console.error(errorBody)

      console.error('[proxyRoute] HTTPError:', {
        status: error.response.status,
        body: errorBody,
      })

      return NextResponse.json(errorBody, { status: error.response.status })
    }

    // Forward known Error messages instead of generic fallback
    if (error instanceof Error) {
      console.error('[proxyRoute] Error:', error.message, error.stack)
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      )
    }

    // Fallback for truly unexpected errors
    console.error('[proxyRoute] Unknown error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    )
  }
}
