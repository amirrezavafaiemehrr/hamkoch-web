import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  phone: string;
  fullName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (phone: string, fullName: string) => void;
  updateName: (fullName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'hamkoch_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (phone: string, fullName: string) => {
    const newUser = { phone, fullName };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const updateName = (fullName: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, fullName };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, updateName, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
