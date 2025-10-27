'use client';

import React, { createContext, useContext, useEffect, useState} from "react";
import { login as apiLogin, logout as apiLogout, getUser, getToken, clearAuthData } from "@/lib/api"; 
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; 
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const checkAuth = () => {
    setLoading(true); 
    const token = getToken();
    const u = getUser();
    if (token && u) {
      setUser(u);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false); 
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password); 
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true; 
      } else {
        toast.error(response.message || 'Login Gagal');
        return false; 
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Tidak dapat terhubung ke server');
      return false; 
    }
  };

  const logout = async () => {
    try {
      await apiLogout(); 
    } catch (error) {
      console.error('API logout error:', error);
    } finally {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      
      // Cek apakah kita di halaman admin, jika iya, redirect ke login
      // Jika tidak (di halaman customer), redirect ke home
      if (window.location.pathname.startsWith('/admin')) {
         router.push('/login');
      } else {
         router.push('/');
      }
      toast.success('Logout berhasil');
    }
  };

  useEffect(() => {
    checkAuth();
    
    const handleLogoutEvent = () => logout();
    window.addEventListener("logout", handleLogoutEvent);
    
    return () => window.removeEventListener("logout", handleLogoutEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

