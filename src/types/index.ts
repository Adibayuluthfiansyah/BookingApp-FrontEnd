export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'customer'
  phone?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

// export interface Venue {
//   id: number;
//   name: string;
//   address: string;
//   price_per_hour: number;
//   type: string;
//   image: string;
//   facilities: string[];
//   description: string;
//   rating: number; // Added rating field
//   fields: Field[]; // Changed from inline to Field interface
// }


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
  created_at: string;
  updated_at: string;
  facilities?: Facility[];
  fields?: Field[];
  images?: VenueImage[];
}

// export interface Field {
//   id: number;
//   venue_id: number;
//   name: string;
//   type: 'futsal' | 'minisoccer';
//   status: 'active' | 'maintenance';
// }

export interface Field {
  id: number;
  venue_id: number;
  name: string;
  field_type: 'futsal' | 'minisoccer' | 'other';
  description: string | null;
  time_slots?: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  field_id: number;
  start_time: string;
  end_time: string;
  price: number;
  is_available: boolean;
  day_type: 'weekday' | 'weekend' | 'all';
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number
  user_id: number
  venue_id: number
  booking_date: string
  start_time: string
  end_time: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed'
  notes?: string
  user: User
  venue: Venue
  created_at: string
  updated_at: string
}

// New interfaces for booking flow
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
  venue_id: number
  field_id: number
  booking_date: string
  time_slots: number[] // Array of time slot IDs
  customer_name: string
  customer_phone: string
  customer_email?: string
  notes?: string
  payment_method: string
  total_price: number
}

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'customer';
// }

// export interface LoginResponse {
//   success: boolean;
//   message: string;
//   data: {
//     user: User;
//     token: string;
//   };
// }

export interface LoginResponse extends ApiResponse {
  data: {
    user: User;
    token: string;
  } | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
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
  onVenueClick?: (venue: Venue) => void // Made optional since we handle routing internally
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