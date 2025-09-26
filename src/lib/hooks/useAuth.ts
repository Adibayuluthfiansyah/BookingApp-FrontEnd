
import { useState } from 'react';
import * as api from '@/lib/api';

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

      const response = await api.login(data.email, data.password);

      if (!response.success) {
        setError(response.message || 'Login gagal');
        return false;
      }

      // Check if user is admin
      if (response.data.user.role !== 'admin') {
        setError('Anda tidak memiliki akses admin');
        await api.logout(); // Clear any stored data
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await api.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
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

      if (!response.success) {
        setError(response.message || 'Login gagal');
        return false;
      }

      // Check if user is customer
      if (response.data.user.role !== 'customer') {
        setError('Anda tidak memiliki akses customer');
        await api.logout(); // Clear any stored data
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await api.logout();
    } catch (err: any) {
      console.error('Logout error:', err);
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