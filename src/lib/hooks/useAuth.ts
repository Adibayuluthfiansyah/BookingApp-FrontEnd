import { useState } from "react";
import * as api from "@/lib/api";
import { LoginResponse } from "@/types";
interface LoginData {
  email: string;
  password: string;
}

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response: LoginResponse = await api.login(data.email, data.password);

      if (!response.success || !response.data) {
        setError(response.message || "Login gagal");
        return false;
      }

      // Check if user is admin or super_admin
      if (
        response.data.user.role !== "admin" &&
        response.data.user.role !== "super_admin"
      ) {
        setError("Anda tidak memiliki akses admin");
        await api.logout(); // Clear any stored data
        return false;
      }


      return true;
    } catch (error: unknown) { 
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat login";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await api.logout();
    } catch (error: unknown) { 
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Logout error:", message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    logout,
    loading,
    error,
    clearError,
  };
};

export const useCustomerAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.login(data.email, data.password);

      if (!response.success || !response.data) {
        setError(response.message || "Login gagal");
        return false;
      }

      // Check if user is customer
      if (response.data.user.role !== "customer") {
        setError("Akun ini bukan akun customer."); 
        await api.logout(); // Clear any stored data
        return false;
      }

      return true;
    } catch (error: unknown) {
      //Cek tipe error
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat login";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await api.logout();
    } catch (error: unknown) { 
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Logout error:", message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    logout,
    loading,
    error,
    clearError,
  };
};