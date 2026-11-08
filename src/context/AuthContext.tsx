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
    const cleanPin = (pin || '').trim();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.token)) {
        setToken(data.token || 'stmarys-auth-token');
        return true;
      }
    } catch (err) {
      console.warn('API login check failed, falling back to local credentials:', err);
    }

    // Local / offline fallback check
    if (cleanPin === 'stmarys1976' || cleanPin === '5026') {
      setToken('stmarys-auth-token');
      return true;
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
