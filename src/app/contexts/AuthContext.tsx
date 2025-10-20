
'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  login as apiLogin, 
  logout as apiLogout, 
  getUser, 
  getToken, 
  clearAuthData 
} from "@/lib/api"; // Memastikan clearAuthData di-import
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // MODIFIKASI: Pindahkan useRouter ke dalam komponen AuthProvider
  const router = useRouter();

  const checkAuth = () => {
    const token = getToken();
    const u = getUser();
    if (token && u) {
      setUser(u);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // MODIFIKASI: Perbaiki login untuk menangani LoginResponse dari api.ts
  const login = async (email: string, password: string) => {
    try {
      // apiLogin mengembalikan { success, message, data: { token, user } }
      const response = await apiLogin(email, password); 
      
      if (response.success && response.data) {
        // Set state context berdasarkan data yang berhasil
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true; // Login berhasil
      } else {
        // Tampilkan pesan error dari API jika login gagal
        toast.error(response.message || 'Login Gagal');
        return false; // Login gagal
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Tidak dapat terhubung ke server');
      return false; // Login gagal karena exception
    }
  };

  // MODIFIKASI: Ini adalah fungsi logout yang disentralisasi
  const logout = async () => {
    try {
      await apiLogout(); // Panggil API logout
    } catch (error) {
      console.error('API logout error:', error);
      // Tetap lanjutkan proses logout di frontend meskipun API gagal
    } finally {
      // Hapus data lokal (sudah dilakukan di apiLogout, tapi aman untuk memastikan)
      clearAuthData();
      // Set state menjadi tidak terotentikasi
      setUser(null);
      setIsAuthenticated(false);
      // Lakukan redirect HANYA DI SINI
      router.push('/login'); // router sekarang tersedia di sini
      toast.success('Logout berhasil');
    }
  };

  useEffect(() => {
    checkAuth();
    // Logika event listener 'logout' Anda tetap dipertahankan
    const handleLogout = () => logout();
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Tambahkan dependency array kosong jika checkAuth hanya perlu jalan sekali

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};