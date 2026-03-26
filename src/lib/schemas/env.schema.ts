import { z } from 'zod'

/**
 * Environment Variables Schema
 * Validation schema for environment variables
 */

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_AUTHORIZATION_TOKEN: z.string(),
})
