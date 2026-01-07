'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { loginApi, registerApi, logoutApi } from '@/lib/apis/client/auth-apis';
import type {
  ILoginCredentials,
  IRegisterData,
  IAuthContextType,
} from '@/lib/types/interfaces/apis/auth.interfaces';
import { validateAccessTokenApi } from '@/lib/apis/server/user-apis';
import { EmailVerificationModal } from '@/components/auth/email-verification-modal';

const AuthContext = createContext<IAuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated, isLoading, setUser, setLoading, clearAuth } =
    useAuthStore();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Show verification modal when user is authenticated but email is not verified
  useEffect(() => {
    if (isAuthenticated && user && !user.isEmailVerified) {
      setShowVerificationModal(true);
    } else {
      setShowVerificationModal(false);
    }
  }, [isAuthenticated, user]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const response = await validateAccessTokenApi();

        if (!response.success) throw new Error(response.message);

        const { valid: isAuth, user: userData } = response.data.data;

        if (isAuth && userData) {
          setUser(userData);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuth();
      }
    };

    initAuth();
  }, [setUser, setLoading, clearAuth]);

  const login = async (credentials: ILoginCredentials) => {
    setLoading(true);
    try {
      const userData = await loginApi(credentials);
      setUser(userData);
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const register = async (data: IRegisterData) => {
    setLoading(true);
    try {
      const userData = await registerApi(data);
      setUser(userData);
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAuth();
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await validateAccessTokenApi();
      if (!response.success) throw new Error(response.message);
      const { valid: isAuth, user: userData } = response.data.data;
      if (isAuth && userData) {
        setUser(userData);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
      clearAuth();
    }
  };

  const value: IAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && (
        <EmailVerificationModal
          open={showVerificationModal}
          onOpenChange={setShowVerificationModal}
          userEmail={user.email}
          onVerificationSuccess={() => {
            setShowVerificationModal(false);
          }}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
