'use client';

import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { login, LoginCredentials } from '../lib/auth';

interface AuthContextType {
  token: string | null;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const loginUser = async (credentials: LoginCredentials): Promise<void> => {
    const response = await login(credentials);
    if (response.status !== 200) {
      throw new Error('Invalid credentials');
    }
    setCookie('token', await response.data.tokens.accessToken);
    setToken(await response.data.tokens.accessToken);
    router.push('/messages');
  };

  const logoutUser = async () => {
    if (typeof window !== 'undefined') {
      deleteCookie('token');
    }
    setToken(null);
    router.push('/login');
  };

  return <AuthContext.Provider value={{ token, loginUser, logoutUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
