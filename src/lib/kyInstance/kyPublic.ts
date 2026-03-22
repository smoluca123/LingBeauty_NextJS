"use server";
import { env } from "@/lib/env.config";
import ky from "ky";

/**
 * Public ky instance for server-side API calls that don't require authentication.
 * This instance doesn't use cookies() which can cause issues on Vercel serverless.
 */
export const kyPublicInstance = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
  },
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    });
  },
  timeout: 30000, // 30 second timeout for Vercel
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});
