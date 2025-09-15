export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  price_per_hour: number;
  facilities: string[];
  rating: number;
  fields: Field[];
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