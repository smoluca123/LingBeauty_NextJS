import { NextResponse } from "next/server";
import { isKyHttpError } from "@/lib/utils/error-handler";

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
    const result = await handlerFn();
    return NextResponse.json(result);
  } catch (error) {
    // Forward the exact BE error response (status code + body) to the client
    if (isKyHttpError(error)) {
      const errorBody = await error.response.json().catch(() => ({
        success: false,
        message: error.message,
      }));
      return NextResponse.json(errorBody, { status: error.response.status });
    }

    // Fallback for unexpected errors
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

