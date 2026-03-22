import { ICategoryDataType } from "@/lib/types/interfaces/apis/header.interfaces";
import { clsx, type ClassValue } from "clsx";
import { HTTPError } from "ky";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

/**
 * Recursively find a category by slug in a nested category tree.
 */
export function findCategoryBySlug(
  categories: ICategoryDataType[],
  slug: string,
): ICategoryDataType | null {
  for (const cat of categories) {
    if (cat.slug.toLowerCase() === slug.toLowerCase()) {
      return cat;
    }
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryBySlug(cat.children, slug);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Format number to readable string (e.g. 1700 -> "1.7K")
 */

const countFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(count: number): string {
  return countFormatter.format(count);
}

// ============ Helper: safely parse ky HTTPError response ============
// error.response.json() can throw SyntaxError when the response body is
// plain text (e.g. Next.js 500 "Internal Server Error"). Wrapping it
// prevents the SyntaxError from escaping the outer catch block.
export async function extractErrorMessage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  fallback: string,
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const errorData = await error.response.json();
      return errorData?.message || fallback;
    } catch {
      // Response body is not JSON (e.g. plain-text 500 from Next.js)
      return error.message || fallback;
    }
  }
  return error?.message || fallback;
}

// Roles allowed to access admin panel
const ADMIN_ROLES = ["ADMINISTRATOR", "MANAGER"] as const;
type AdminRole = (typeof ADMIN_ROLES)[number];
export function hasAdminRole(
  roleAssignments?: { role: { name: string } }[],
): boolean {
  if (!roleAssignments || roleAssignments.length === 0) return false;
  return roleAssignments.some((ra) =>
    (ADMIN_ROLES as readonly AdminRole[]).includes(ra.role.name as AdminRole),
  );
}
