import { ApiResponse } from "@/types"
import { LoginCredentials } from "@/types"
import { User } from "@/types"
import { Venue } from "@/types"
import { Booking } from "@/types"
import { AdminStats } from "@/types"

// Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  API_PREFIX: '/api',
  TIMEOUT: 10000,
}

// API Client Class
class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  // Get auth token from localStorage
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token') || localStorage.getItem('customer_token')
    }
    return null
  }

  // Get admin token specifically
  private getAdminToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token')
    }
    return null
  }

  // Get customer token specifically
  private getCustomerToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('customer_token')
    }
    return null
  }

  // Create headers with auth token
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers = { ...this.defaultHeaders }
    
    if (includeAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.getHeaders(includeAuth),
          ...options.headers,
        },
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // GET request
  private async get<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, includeAuth)
  }

  // POST request
  private async post<T>(
    endpoint: string,
    body: any = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      includeAuth
    )
  }

  // PUT request
  private async put<T>(
    endpoint: string,
    body: any = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      includeAuth
    )
  }

  // DELETE request
  private async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, includeAuth)
  }

  // PATCH request
  private async patch<T>(
    endpoint: string,
    body: any = {},
    includeAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
      includeAuth
    )
  }

  // =================== AUTH METHODS ===================

  // Admin Login
  async adminLogin(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.post('/auth/admin/login', credentials, false)
  }

  // Customer Login
  async customerLogin(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.post('/auth/customer/login', credentials, false)
  }

  // Admin Logout
  async adminLogout(): Promise<ApiResponse> {
    return this.post('/auth/admin/logout', {}, true)
  }

  // Customer Logout
  async customerLogout(): Promise<ApiResponse> {
    return this.post('/auth/customer/logout', {}, true)
  }

  // Get authenticated user
  async getAuthUser(): Promise<ApiResponse<User>> {
    return this.get('/auth/user')
  }

  // =================== ADMIN METHODS ===================

  // Get dashboard stats
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return this.get('/admin/dashboard')
  }

  // Get all users
  async getUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<{ users: User[]; total: number; current_page: number; last_page: number }>> {
    return this.get(`/admin/users?page=${page}&limit=${limit}`)
  }

  // Get user by ID
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.get(`/admin/users/${id}`)
  }

  // Create user
  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.post('/admin/users', userData)
  }

  // Update user
  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put(`/admin/users/${id}`, userData)
  }

  // Delete user
  async deleteUser(id: number): Promise<ApiResponse> {
    return this.delete(`/admin/users/${id}`)
  }

  // =================== VENUE METHODS ===================

  // Get all venues
  async getVenues(page: number = 1, limit: number = 10): Promise<ApiResponse<{ venues: Venue[]; total: number; current_page: number; last_page: number }>> {
    return this.get(`/admin/venues?page=${page}&limit=${limit}`)
  }

  // Get venue by ID
  async getVenueById(id: number): Promise<ApiResponse<Venue>> {
    return this.get(`/admin/venues/${id}`)
  }

  // Create venue
  async createVenue(venueData: Partial<Venue>): Promise<ApiResponse<Venue>> {
    return this.post('/admin/venues', venueData)
  }

  // Update venue
  async updateVenue(id: number, venueData: Partial<Venue>): Promise<ApiResponse<Venue>> {
    return this.put(`/admin/venues/${id}`, venueData)
  }

  // Delete venue
  async deleteVenue(id: number): Promise<ApiResponse> {
    return this.delete(`/admin/venues/${id}`)
  }

  // =================== BOOKING METHODS ===================

  // Get all bookings
  async getBookings(page: number = 1, limit: number = 10): Promise<ApiResponse<{ bookings: Booking[]; total: number; current_page: number; last_page: number }>> {
    return this.get(`/admin/bookings?page=${page}&limit=${limit}`)
  }

  // Get booking by ID
  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    return this.get(`/admin/bookings/${id}`)
  }

  // Update booking status
  async updateBookingStatus(id: number, status: string): Promise<ApiResponse<Booking>> {
    return this.patch(`/admin/bookings/${id}/status`, { status })
  }

  // =================== CUSTOMER METHODS ===================

  // Get customer venues (public)
  async getPublicVenues(page: number = 1, limit: number = 10): Promise<ApiResponse<{ venues: Venue[]; total: number; current_page: number; last_page: number }>> {
    return this.get(`/venues?page=${page}&limit=${limit}`, false)
  }

  // Create booking
  async createBooking(bookingData: {
    venue_id: number
    booking_date: string
    start_time: string
    end_time: string
    notes?: string
  }): Promise<ApiResponse<Booking>> {
    return this.post('/customer/bookings', bookingData)
  }

  // Get customer bookings
  async getCustomerBookings(): Promise<ApiResponse<Booking[]>> {
    return this.get('/customer/bookings')
  }

  // Cancel booking
  async cancelBooking(id: number): Promise<ApiResponse> {
    return this.patch(`/customer/bookings/${id}/cancel`, {})
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// =================== UTILITY FUNCTIONS ===================

// Store auth data
export const storeAuthData = (type: 'admin' | 'customer', token: string, user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${type}_token`, token)
    localStorage.setItem(`${type}_user`, JSON.stringify(user))
  }
}

// Remove auth data
export const removeAuthData = (type: 'admin' | 'customer') => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${type}_token`)
    localStorage.removeItem(`${type}_user`)
  }
}

// Get stored user data
export const getStoredUser = (type: 'admin' | 'customer'): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(`${type}_user`)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        removeAuthData(type)
      }
    }
  }
  return null
}

// Check if user is authenticated
export const isAuthenticated = (type: 'admin' | 'customer'): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(`${type}_token`)
    return !!token
  }
  return false
}

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format datetime
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Handle API errors
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.message) {
    return error.message
  }
  return 'Terjadi kesalahan yang tidak terduga'
}

// Export the API client instance
export default apiClient