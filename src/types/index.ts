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
  fields: {
    id: number;
    name: string;
    price: number;
    image: string;
  }[];
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