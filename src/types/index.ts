
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer' | 'super_admin'
  phone?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface Venue {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  facebook_url: string | null;
  instagram_url: string | null;
  phone?: string; 
  email?: string; 
  created_at: string;
  updated_at: string;
  facilities?: Facility[];
  fields?: Field[];
  images?: VenueImage[];
}

export interface Field {
  id: number;
  venue_id: number;
  name: string;
  field_type: string;
  created_at: string;
  updated_at: string;
  description?: string | null;
  venue?: Venue; 
  time_slots?: TimeSlot[]; 
}

export interface SimpleField {
  id: number;
  name: string; 
}
export interface TimeSlot {
  id: number;
  field_id: number;
  start_time: string; 
  end_time: string; 
  price: number;
  created_at?: string;
  updated_at?: string;
  field?: Field; 
}

export interface TimeSlotWithStatus extends TimeSlot {
  is_available: boolean;
  booking_status: 'available' | 'booked';
  is_past_slot: boolean;
  booking_info?: {
    booking_number: string;
    customer_name: string;
    status: string;
    payment_status: string;
  } | null;
}

export interface Booking {
  id: number
  booking_number: string
  user_id: number | null
  field_id: number
  time_slot_id: number
  booking_date: string
  start_time: string
  end_time: string
  customer_name: string
  customer_phone: string
  customer_email: string
  notes?: string
  subtotal: number
  admin_fee: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'paid'
  created_at: string
  updated_at: string
  field?: Field
  payment?: Payment
  user?: User
}

export interface Payment {
  id: number
  booking_id: number
  amount: number
  payment_method: string
  payment_status: 'pending' | 'verified' | 'rejected'
  snap_token?: string
  paid_at?: string
  created_at: string
  updated_at: string
}

export interface BookingSlot {
  date: string
  timeSlot: TimeSlot
  fieldId: number
  fieldName: string
}

export interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
  paymentMethod: 'transfer' | 'ewallet' | 'cash'
}

export interface BookingRequest {
  field_id: number
  time_slot_id: number
  booking_date: string
  customer_name: string
  customer_phone: string
  customer_email: string
  notes?: string
}

export interface LoginResponse extends ApiResponse {
  data: {
    user: User;
    token: string;
  } | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T | null; 
  meta?: Record<string, unknown>;   
  errors?: Record<string, unknown>; 
}
export interface AdminStats {
  total_users: number
  total_venues: number
  total_bookings: number
  monthly_revenue: number
  today_bookings: number
  active_users: number
}

export interface DashboardStats {
  total_bookings: number;
  total_customers: number;
  total_fields: number;
  revenue_today: number;
}

export interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  changeType?: 'increase' | 'decrease';
  color: string;
}

export interface QuickActionProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export interface VenuesCardProps {
  venue: Venue
  viewMode: 'grid' | 'list'
  onVenueClick?: (venue: Venue) => void
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface Facility {
  id: number;
  name: string;
  icon: string;
}

export interface VenueImage {
  id: number;
  venue_id: number;
  image_url: string;
  caption: string | null;
  display_order: number;
}
