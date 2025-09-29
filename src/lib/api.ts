
import { ApiResponse, User, LoginResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function untuk mendapatkan user - FIXED VERSION
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Clear corrupted data
    localStorage.removeItem('user');
    return null;
  }
};

// Helper function untuk check apakah user sudah login
export const isAuthenticated = (role?: 'admin' | 'customer'): boolean => {
  const token = getToken();
  const user = getUser();
  
  if (!token || !user) return false;
  
  if (role) {
    return user.role === role;
  }
  
  return true;
};

// Helper function untuk menyimpan auth data
const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Helper function untuk menghapus auth data
const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// API Functions

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      saveAuthData(data.data.token, data.data.user);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Tidak dapat terhubung ke server',
      data: null
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<ApiResponse> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      clearAuthData();
    }

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    // Clear data anyway on error
    clearAuthData();
    return {
      success: true,
      message: 'Logout berhasil'
    };
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};

/**
 * Refresh token
 */
export const refreshToken = async (): Promise<ApiResponse<{ token: string }>> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success && data.data) {
    localStorage.setItem('token', data.data.token);
  }

  return data;
};

/**
 * Get admin dashboard data
 */
export const getAdminDashboard = async (): Promise<ApiResponse> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};

/**
 * Get customer bookings
 */
export const getCustomerBookings = async (): Promise<ApiResponse> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/customer/bookings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};