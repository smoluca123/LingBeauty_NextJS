/**
 * Auth Form Types
 * Types for authentication-related forms
 */

export interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgetPasswordFormValues {
  email: string;
}
