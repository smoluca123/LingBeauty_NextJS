import { z } from 'zod';

/**
 * Helper function to create a required string with custom error message
 */
export const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required`);
