import { ApiResponse, User, LoginResponse, Venue, TimeSlotWithStatus } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// ==================== Auth Helper Functions ====================

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

// ==================== Auth API Functions ====================

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

// ==================== Venue API Functions ====================

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

    const url = `${API_BASE_URL}/venues?${queryParams.toString()}`;
    
    console.log('Fetching venues from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Venues response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    return {
      success: false,
      message: 'Gagal mengambil data venue',
      data: []
    };
  }
};

export const getVenue = async (identifier: string | number): Promise<ApiResponse<Venue>> => {
  try {
    const url = `${API_BASE_URL}/venues/${identifier}`;
    
    console.log('Fetching venue from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Venue response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching venue:', error);
    return {
      success: false,
      message: 'Gagal mengambil data venue',
      data: null as any
    };
  }
};

export const getVenueBySlug = getVenue;
export const getVenueById = getVenue;

// ==================== UPDATED: Get Available Slots with Status ====================
export const getAvailableSlots = async (
  venueId: number,
  params: { field_id: number; date: string }
): Promise<ApiResponse<TimeSlotWithStatus[]>> => {
  try {
    const queryParams = new URLSearchParams({
      field_id: params.field_id.toString(),
      date: params.date,
    });

    const url = `${API_BASE_URL}/venues/${venueId}/available-slots?${queryParams.toString()}`;
    
    console.log('Fetching slots with status from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch slots");
    }
    
    const data = await response.json();
    console.log('Slots response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching slots:', error);
    return { 
      success: false, 
      message: 'Gagal mengambil slot jadwal', 
      data: [] 
    };
  }
};

// ==================== Booking API Functions ====================

export const createBooking = async (bookingData: {
  field_id: number;
  time_slot_id: number;
  booking_date: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes?: string;
}): Promise<ApiResponse<{ booking: any; snap_token: string }>> => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create booking');
    }

    return result;
  } catch (error) {
    console.error('Create booking error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal membuat booking',
      data: null as any,
    };
  }
};

export const getBookingStatus = async (bookingNumber: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingNumber}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Get booking status error:', error);
    return {
      success: false,
      message: 'Gagal mengambil status booking',
      data: null,
    };
  }
};

export const cancelBooking = async (bookingNumber: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingNumber}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Cancel booking error:', error);
    return {
      success: false,
      message: 'Gagal membatalkan booking',
      data: null,
    };
  }
};

// ==================== Admin API Functions ====================

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