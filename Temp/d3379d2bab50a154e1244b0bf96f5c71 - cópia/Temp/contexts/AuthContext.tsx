
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Default admin credentials (can be overridden by env vars on server)
  const DEFAULT_ADMIN = {
    user: (import.meta.env.VITE_ADMIN_USER as string) || 'admin',
    pass: (import.meta.env.VITE_ADMIN_PASS as string) || 'admin',
  };

  const login = (username: string, password: string) => {
    const ok = username === DEFAULT_ADMIN.user && password === DEFAULT_ADMIN.pass;
    if (ok) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
