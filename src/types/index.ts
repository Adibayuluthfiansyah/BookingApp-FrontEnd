export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  price_per_hour: number;
  type: string;
  image: string;
  facilities: string[];
  description: string;
  rating: number; // Added rating field
  fields: Field[]; // Changed from inline to Field interface
}

export interface Field {
  id: number;
  venue_id: number;
  name: string;
  type: 'futsal' | 'minisoccer';
  status: 'active' | 'maintenance';
}

export interface TimeSlot {
  id: number;
  field_id: number;
  start_time: string;
  end_time: string;
  price: number;
  is_available: boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  field_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  notes?: string;
  venue_name: string;
  field_name: string;
}

export interface VenuesCardProps {
  venue: Venue
  viewMode: 'grid' | 'list'
  onVenueClick?: (venue: Venue) => void // Made optional since we handle routing internally
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

