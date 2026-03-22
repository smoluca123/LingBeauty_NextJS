/**
 * User Form Types
 * Types for user profile and account forms
 */

export interface UpdateUserInfoFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
  website?: string;
}

export interface AccountFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
