import { envSchema } from '@/lib/schemas/env.schema'

const envParsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_AUTHORIZATION_TOKEN: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
})

if (!envParsed.success) {
  console.error(envParsed.error.message)
  throw new Error('Invalid environment variables')
}

export const env = envParsed.data
