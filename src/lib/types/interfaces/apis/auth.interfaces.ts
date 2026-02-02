import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

// ============ Auth Request Types ============
export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  username: string;
}

export interface IValidateTokenResponseType {
  valid: boolean;
  user: IUserDataType;
  expiresAt: string;
}

// ============ Auth Response Types ============
export interface IAuthResponse {
  user: IUserDataType;
  accessToken: string;
}

// ============ Auth Error Types ============
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  REFRESH_FAILED = 'REFRESH_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export interface IAuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
}

// ============ Auth State Types ============
export interface IAuthState {
  user: IUserDataType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============ Auth Context Types ============
export interface IAuthContextType extends IAuthState {
  login: (credentials: ILoginCredentials) => Promise<void>;
  register: (data: IRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// ============ Cookie Types ============
export interface IAuthCookieData {
  accessToken: string;
  userId: string;
}

export interface IAuthApiResponse {
  message: string;
  data?: { user: IUserDataType };
}

export interface IGetAuthResponse {
  isAuthenticated: boolean;
  user: IUserDataType | null;
  expiresAt: Date | null;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  message: string;
}

export interface IChangePasswordError {
  message: string;
  errorCode: string;
}
