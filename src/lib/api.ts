import {ApiResponse,User,LoginResponse,Venue,TimeSlotWithStatus,TimeSlot,SimpleField,Facility,Field,Booking, } from "@/types";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_BASE_URL = typeof window === 'undefined'
  ? process.env.INTERNAL_API_URL ?? "http://nginx/api"
  : "http://127.0.0.1:8000/api";  // Tambahkan default fallback

// ==================== Auth Helper Functions ====================

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : "Unknown error"; 
    console.error("Error parsing user data:", message);
    localStorage.removeItem("user");
    return null;
  }
};

export const saveAuthData = (token: string, user: User): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==================== Auth API Functions ====================

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data) {
      saveAuthData(data.data.token, data.data.user);
    }

    return data;
  } catch (error: unknown) { 
    const message = error instanceof Error ? error.message : "Unknown error"; 
    console.error("Login error:", message);
    return {
      success: false,
      message: "Tidak dapat terhubung ke server",
      data: null,
    };
  }
};

export const logout = async (): Promise<ApiResponse> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    clearAuthData();

    return data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Logout error:", message);
    clearAuthData();
    return {
      success: true,
      message: "Logout berhasil",
      data: null, 
    };
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<{ user: User }>> => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
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

    if (params?.search) queryParams.append("search", params.search);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.sort) queryParams.append("sort", params.sort);

    const url = `${API_BASE_URL}/venues?${queryParams.toString()}`;

    console.log("Fetching venues from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Venues response:", data);

    return data;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching venues:", message);
    return {
      success: false,
      message: "Gagal mengambil data venue",
      data: [], // data: [] sudah benar
    };
  }
};

export const getVenue = async (
  identifier: string | number,
): Promise<ApiResponse<Venue>> => {
  try {
    const url = `${API_BASE_URL}/venues/${identifier}`;

    console.log("Fetching venue from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Venue response:", data);

    return data;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching venue:", message);
    return {
      success: false,
      message: "Gagal mengambil data venue",
      data: null, // PERBAIKAN: Hapus 'as any'
    };
  }
};

export const getVenueBySlug = getVenue;
export const getVenueById = getVenue;

// ==================== Admin Venue Management ====================

export const getAdminVenues = async (): Promise<ApiResponse<Venue[]>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching admin venues:", message);
    return {
      success: false,
      message: "Gagal mengambil data venue",
      data: [],
    };
  }
};

// PERBAIKAN: Ganti tipe Array<...> dengan SimpleField[]
export const getMyVenues = async (): Promise<ApiResponse<SimpleField[]>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/my-venues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching my venues:", message);
    return {
      success: false,
      message: "Gagal mengambil venue",
      data: [],
    };
  }
};

// PERBAIKAN: Ganti 'venueData: any' dengan 'venueData: Partial<Venue>'
export const createVenue = async (
  venueData: Partial<Venue>,
): Promise<ApiResponse<Venue>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/venues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venueData),
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error creating venue:", message);
    return {
      success: false,
      message: "Gagal membuat venue",
      data: null, // PERBAIKAN: Hapus 'as any'
    };
  }
};

// PERBAIKAN: Ganti 'venueData: any' dengan 'venueData: Partial<Venue>'
export const updateVenue = async (
  id: number,
  venueData: Partial<Venue>,
): Promise<ApiResponse<Venue>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/venues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(venueData),
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error updating venue:", message);
    return {
      success: false,
      message: "Gagal mengupdate venue",
      data: null, // PERBAIKAN: Hapus 'as any'
    };
  }
};

export const deleteVenue = async (id: number): Promise<ApiResponse> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/venues/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error deleting venue:", message);
    return {
      success: false,
      message: "Gagal menghapus venue",
    };
  }
};

// ==================== Admin Field Management ====================

export const getAdminFields = async (): Promise<ApiResponse<Field[]>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching admin fields:", message);
    return {
      success: false,
      message: "Gagal mengambil data lapangan",
      data: [],
    };
  }
};

export const getAdminFieldDetail = async (
  id: number,
): Promise<ApiResponse<Field>> => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/fields/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil data lapangan");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null }; // PERBAIKAN: Tambahkan 'data: null'
  }
};

export const createAdminField = async (data: {
  name: string;
  venue_id: number;
  field_type: string;
  description?: string;
}): Promise<ApiResponse<Field>> => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/fields`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Gagal membuat lapangan");
    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    // PERBAIKAN: 'error.errors' mungkin tidak ada, kirim 'unknown'
    return { success: false, message: message, errors: { error } };
  }
};

export const updateAdminField = async (
  id: number,
  data: {
    name: string;
    field_type: string;
    description?: string;
  },
): Promise<ApiResponse<Field>> => {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/fields/${id}`, {
      method: "PUT", // Gunakan PUT (sesuai apiResource)
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.message || "Gagal mengupdate lapangan");
    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, errors: { error } }; // PERBAIKAN: 'error.errors' mungkin tidak ada
  }
};

export const deleteAdminField = async (id: number): Promise<ApiResponse> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/fields/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error deleting field:", message);
    return {
      success: false,
      message: "Gagal menghapus lapangan",
    };
  }
};

// ==================== Get Available Slots with Status ====================
export const getAvailableSlots = async (
  venueId: number,
  params: { field_id: number; date: string },
): Promise<ApiResponse<TimeSlotWithStatus[]>> => {
  try {
    const queryParams = new URLSearchParams({
      field_id: params.field_id.toString(),
      date: params.date,
    });

    const url = `${API_BASE_URL}/venues/${venueId}/available-slots?${queryParams.toString()}`;

    console.log("Fetching slots with status from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch slots");
    }

    const data = await response.json();
    console.log("Slots response:", data);

    return data;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching slots:", message);
    return {
      success: false,
      message: "Gagal mengambil slot jadwal",
      data: [],
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
  // PERBAIKAN: Ganti 'booking: any' dengan 'booking: Booking'
}): Promise<ApiResponse<{ booking: Booking; snap_token: string }>> => {
  // ✅ Ambil token jika ada (optional)
  const token = getToken();

  try {
    console.log("Creating booking with data:", bookingData);
    console.log("User logged in:", !!token); // Log status login

    // ✅ Buat headers dasar
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // ✅ Tambahkan Authorization header HANYA jika user login
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers,
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create booking");
    }

    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    console.error("Create booking error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat booking",
      data: null, // PERBAIKAN: Hapus 'as any'
    };
  }
};

// PERBAIKAN: Ganti 'ApiResponse<any>' dengan 'ApiResponse<Booking>'
export const getBookingStatus = async (
  bookingNumber: string,
): Promise<ApiResponse<Booking>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingNumber}/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Get booking status error:", message);
    return {
      success: false,
      message: "Gagal mengambil status booking",
      data: null,
    };
  }
};

// PERBAIKAN: Ganti 'ApiResponse<any>' dengan 'ApiResponse<Booking>'
export const cancelBooking = async (
  bookingNumber: string,
): Promise<ApiResponse<Booking>> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingNumber}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Cancel booking error:", message);
    return {
      success: false,
      message: "Gagal membatalkan booking",
      data: null,
    };
  }
};

// ==================== Admin API Functions ====================

export const getAdminDashboardStats = async (
  timezone: string,
): Promise<ApiResponse> => {
  const token = getToken();

  try {
    const queryParams = new URLSearchParams();
    queryParams.append("tz", timezone);
    const url = `${API_BASE_URL}/admin/dashboard?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearAuthData();
        window.location.href = "/login";
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching admin dashboard stats:", message);
    return {
      success: false,
      message: "Gagal mengambil statistik dashboard",
    };
  }
};

export const getAdminBookings = async (params?: {
  status?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
  venue_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
}): Promise<ApiResponse<Booking[]>> => { // PERBAIKAN: Tambahkan tipe Booking[]
  const token = getToken();

  try {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append("status", params.status);
    if (params?.payment_status)
      queryParams.append("payment_status", params.payment_status);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.venue_id)
      queryParams.append("venue_id", params.venue_id.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
    if (params?.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params?.page) queryParams.append("page", params.page.toString());

    const url = `${API_BASE_URL}/admin/bookings?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching admin bookings:", message);
    return {
      success: false,
      message: "Gagal mengambil data booking",
      data: [],
    };
  }
};

// PERBAIKAN: Ganti ApiResponse dengan ApiResponse<Booking>
export const getAdminBookingDetail = async (
  id: number,
): Promise<ApiResponse<Booking>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching booking detail:", message);
    return {
      success: false,
      message: "Gagal mengambil detail booking",
      data: null, // PERBAIKAN: Tambahkan data: null
    };
  }
};

// PERBAIKAN: Ganti ApiResponse dengan ApiResponse<Booking>
export const updateAdminBookingStatus = async (
  id: number,
  data: { status: string; notes?: string },
): Promise<ApiResponse<Booking>> => {
  const token = getToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/bookings/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update status");
    }

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Gagal mengupdate status booking"; // PERBAIKAN: Cek tipe error
    console.error("Error updating booking status:", message);
    return {
      success: false,
      message: message, // PERBAIKAN: Gunakan 'message' yang sudah dicek
      data: null, // PERBAIKAN: Tambahkan data: null
    };
  }
};

// ========= TIME SLOT (HARGA) API (VERSI FETCH) =========

// Helper untuk mendapatkan daftar field milik admin (untuk dropdown)
export async function getMyFieldsList(): Promise<ApiResponse<SimpleField[]>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/my-fields`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil daftar lapangan");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: [] };
  }
}

// Get all time slots (bisa difilter)
export async function getAdminTimeSlots(
  fieldId?: number,
): Promise<ApiResponse<TimeSlot[]>> {
  const token = getToken();
  try {
    const queryParams = new URLSearchParams();
    if (fieldId) queryParams.append("field_id", fieldId.toString());

    const url = `${API_BASE_URL}/admin/timeslots?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil data time slot");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: [] };
  }
}

// Get single time slot by ID
export async function getTimeSlotById(
  id: number,
): Promise<ApiResponse<TimeSlot>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timeslots/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil detail time slot");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null }; // PERBAIKAN: Tambahkan data: null
  }
}

// Create new time slot
export async function createTimeSlot(
  data: Partial<TimeSlot>,
): Promise<ApiResponse<TimeSlot>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timeslots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      // Kirim error validasi jika ada
      return {
        success: false,
        message: result.message,
        errors: result.errors,
      };
    }
    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null }; // PERBAIKAN: Tambahkan data: null
  }
}

// Update time slot
export async function updateTimeSlot(
  id: number,
  data: Partial<TimeSlot>,
): Promise<ApiResponse<TimeSlot>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timeslots/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      // Kirim error validasi jika ada
      return {
        success: false,
        message: result.message,
        errors: result.errors,
      };
    }
    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null }; // PERBAIKAN: Tambahkan data: null
  }
}

// Delete time slot
export async function deleteTimeSlot(id: number): Promise<ApiResponse<null>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/timeslots/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null };
  }
}

// ========= FACILITY API (VERSI FETCH) =========

// Get SEMUA master fasilitas (untuk checkbox)
export async function getAllFacilities(): Promise<ApiResponse<Facility[]>> {
  const token = getToken();
  try {
    const response = await fetch(`${API_BASE_URL}/admin/facilities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Admin route
      },
    });
    if (!response.ok) throw new Error("Gagal mengambil daftar fasilitas");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: [] };
  }
}

// Get fasilitas yang dimiliki SATU venue (berisi array ID)
export async function getVenueFacilities(
  venueId: number,
): Promise<ApiResponse<number[]>> {
  const token = getToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/venues/${venueId}/facilities`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw new Error("Gagal mengambil fasilitas venue");
    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: [] };
  }
}

// Update/sync fasilitas untuk satu venue
// PERBAIKAN: Ganti 'ApiResponse<any>' dengan 'ApiResponse<unknown>'
export async function syncVenueFacilities(
  venueId: number,
  facilityIds: number[],
): Promise<ApiResponse<unknown>> {
  const token = getToken();
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/venues/${venueId}/facilities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          facility_ids: facilityIds,
        }),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result.message, errors: result.errors };
    }
    return result;
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error: any' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    return { success: false, message: message, data: null }; // PERBAIKAN: Tambahkan data: null
  }
}

// ==================== Customer Booking Functions ====================

// Legacy admin functions (for backward compatibility)
export const getAdminDashboard = getAdminDashboardStats;

// PERBAIKAN: Ganti ApiResponse dengan ApiResponse<Booking[]>
export const getCustomerBookings = async (): Promise<ApiResponse<Booking[]>> => {
  const token = getToken();

  try {
    const response = await fetch(`${API_BASE_URL}/customer/bookings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error: unknown) { // PERBAIKAN: Ganti 'error' menjadi 'error: unknown'
    const message = error instanceof Error ? error.message : "Unknown error"; // PERBAIKAN: Cek tipe error
    console.error("Error fetching customer bookings:", message);
    return {
      success: false,
      message: "Gagal mengambil data booking",
      data: [],
    };
  }
};