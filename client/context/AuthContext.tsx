"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'vendor' | 'admin';
  storeName?: string;
  storeLogo?: string;
  storeBanner?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: any) => void; // Deprecated, kept for compatibility but does nothing now
  logout: () => void;
  updateUser: (userData: any) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Sync NextAuth session with our local user state
      // We assume session.user contains the necessary fields mapped in the API route
      const sessionUser = session.user as any;
      setUser({
        _id: sessionUser.id,
        name: sessionUser.name || '',
        email: sessionUser.email || '',
        role: sessionUser.role || 'client',
        storeName: sessionUser.storeName,
        storeLogo: sessionUser.image || sessionUser.storeLogo,
      });
      setToken(sessionUser.accessToken);
    } else if (status === 'unauthenticated') {
      setUser(null);
      setToken(null);
    }
  }, [session, status]);

  const login = (data: any) => {
    // No-op: Login is now handled by NextAuth signIn() in the component
    console.warn("AuthContext.login is deprecated. Use signIn() from next-auth/react instead.");
  };

  const updateUser = (data: any) => {
    // This is tricky with NextAuth as session is immutable on client side without refreshing
    // For now we update local state, but a page reload might reset it if session isn't updated
    // Ideally we should call `update` from useSession, but that requires backend support to refresh token
    const { token: newToken, ...userData } = data;
    if (newToken) setToken(newToken);
    setUser({ ...user, ...userData } as User);
  };

  const logout = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      updateUser, 
      loading: status === 'loading' 
    }}>
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
