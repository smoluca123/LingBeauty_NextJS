import { z } from "zod";

/**
 * Shared Schema Utilities
 * Reusable schema helpers and validators
 */

/**
 * Helper function to create a required string with custom error message
 */
export const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required`);

/**
 * Phone number validation
 */
export const phoneSchema = z
  .string()
  .min(10, "Số điện thoại phải có ít nhất 10 số")
  .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số");

/**
 * Email validation
 */
export const emailSchema = z.string().email("Email không hợp lệ");
