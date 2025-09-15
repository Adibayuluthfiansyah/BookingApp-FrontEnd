import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}


export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export const MOCK_VENUES: Venue[] = [
  {
    id: 1,
    name: "GOR Senayan Futsal",
    description: "Lapangan futsal modern dengan fasilitas lengkap dan AC",
    address: "Jl. Asia Afrika No. 8, Jakarta Pusat",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
    price_per_hour: 150000,
    rating: 4.8,
    facilities: ["AC", "Parkir Luas", "Kantin", "Toilet Bersih", "Ruang Ganti"],
    fields: [
      { id: 1, venue_id: 1, name: "Lapangan A", type: "futsal", status: "active" },
      { id: 2, venue_id: 1, name: "Lapangan B", type: "futsal", status: "active" }
    ]
  },
  {
    id: 2,
    name: "Arena Mini Soccer Plus",
    description: "Lapangan mini soccer outdoor dengan rumput sintetis berkualitas",
    address: "Jl. Sudirman No. 15, Jakarta Selatan",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500",
    price_per_hour: 200000,
    rating: 4.6,
    facilities: ["Rumput Sintetis", "Lampu Sorot", "Parkir", "Security 24 Jam"],
    fields: [
      { id: 3, venue_id: 2, name: "Lapangan 1", type: "minisoccer", status: "active" },
      { id: 4, venue_id: 2, name: "Lapangan 2", type: "minisoccer", status: "maintenance" }
    ]
  },
  {
    id: 3,
    name: "Futsal Center Jakarta",
    description: "Kompleks futsal terlengkap dengan 6 lapangan indoor",
    address: "Jl. Gatot Subroto No. 25, Jakarta Barat",
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=500",
    price_per_hour: 120000,
    rating: 4.7,
    facilities: ["Indoor", "AC", "Sound System", "Cafeteria", "Free WiFi"],
    fields: [
      { id: 5, venue_id: 3, name: "Court 1", type: "futsal", status: "active" },
      { id: 6, venue_id: 3, name: "Court 2", type: "futsal", status: "active" }
    ]
  }
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: 1, field_id: 1, start_time: "08:00", end_time: "09:00", price: 150000, is_available: true },
  { id: 2, field_id: 1, start_time: "09:00", end_time: "10:00", price: 150000, is_available: false },
  { id: 3, field_id: 1, start_time: "10:00", end_time: "11:00", price: 150000, is_available: true },
  { id: 4, field_id: 1, start_time: "16:00", end_time: "17:00", price: 180000, is_available: true },
  { id: 5, field_id: 1, start_time: "17:00", end_time: "18:00", price: 180000, is_available: true },
  { id: 6, field_id: 1, start_time: "18:00", end_time: "19:00", price: 200000, is_available: false },
  { id: 7, field_id: 1, start_time: "19:00", end_time: "20:00", price: 200000, is_available: true },
  { id: 8, field_id: 1, start_time: "20:00", end_time: "21:00", price: 200000, is_available: true },
];

