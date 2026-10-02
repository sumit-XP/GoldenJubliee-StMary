import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  token: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smj_admin_token'));
  const isAdmin = Boolean(token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smj_admin_token', token);
    } else {
      localStorage.removeItem('smj_admin_token');
    }
  }, [token]);

  const login = async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        return true;
      }
    } catch {
      // Offline fallback check
      if (pin === 'stmarys1976') {
        setToken('stmarys-auth-token');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
