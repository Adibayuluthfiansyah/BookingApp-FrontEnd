import { ApiResponse, User, LoginResponse, Venue, TimeSlot } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Auth functions
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

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
      data: null,
    };
  }
};

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
    clearAuthData();
    return {
      success: true,
      message: 'Logout berhasil',
    };
  }
};

// Venue Functions
export const getAllVenues = async (params?: {
  search?: string;
  city?: string;
  sort?: string;
}): Promise<ApiResponse<Venue[]>> => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.city) queryParams.append('city', params.city);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = `${API_BASE_URL}/venues${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

// Get venue by ID or slug (flexible)
export const getVenue = async (identifier: string | number): Promise<ApiResponse<Venue>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues/${identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching venue:', error);
    return {
      success: false,
      message: 'Gagal mengambil data venue',
      data: null as any
    };
  }
};

// Backward compatibility - keep old function name but use new one
export const getVenueBySlug = getVenue;
export const getVenueById = getVenue;

// Get available slots
export const getAvailableSlots = async (
  venueId: number,
  params: { field_id: number; date: string }
): Promise<ApiResponse<TimeSlot[]>> => {
  try {
    const queryParams = new URLSearchParams({
      field_id: params.field_id.toString(),
      date: params.date,
    });

    const response = await fetch(
      `${API_BASE_URL}/venues/${venueId}/schedule?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to fetch available slots');
    return await response.json();
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return { success: false, message: 'Gagal mengambil slot jadwal', data: [] };
  }
};

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