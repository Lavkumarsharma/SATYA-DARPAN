'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api, { setAccessToken } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'author' | 'viewer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check session on mount — try to refresh token from cookie
    const initAuth = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Refresh failed');

        const data = await res.json();
        const token = data?.data?.accessToken;
        if (!token) throw new Error('No token');

        setAccessToken(token);

        const meRes = await fetch(`${apiUrl}/auth/me`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) throw new Error('Me failed');
        const meData = await meRes.json();
        setUser(meData.data);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Route protection — only redirect after loading is done
  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === '/login';

    if (!user && !isLoginPage) {
      router.replace('/login');
    } else if (user && isLoginPage) {
      router.replace('/dashboard');
    }
  }, [user, loading, pathname]);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    router.replace('/dashboard');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.replace('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
