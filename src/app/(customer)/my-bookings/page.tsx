'use client';

import { useState, useEffect } from 'react';
import { getCustomerBookings } from '@/lib/api'; 
import { Booking } from '@/types'; 
import { Card } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
// (Install date-fns jika belum: npm install date-fns)
import { format } from 'date-fns'; 
import { id as indonesianLocale } from 'date-fns/locale';
import Link from 'next/link';

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    // Format: Selasa, 25 Oktober 2025
    return format(new Date(dateString), 'eeee, dd MMMM yyyy', { 
      locale: indonesianLocale 
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString; // Tampilkan string asli jika format gagal
  }
};

// Helper untuk format jam
const formatTime = (time: string | undefined) => {
  if (!time) return '-';
  return time.substring(0, 5); // Ambil HH:MM
};

// Helper untuk badge status
const getStatusBadge = (status: string) => {
  const statuses: Record<string, { color: string; label: string; icon: any }> = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Clock },
    confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmed', icon: CheckCircle },
    paid: { color: 'bg-blue-100 text-blue-800', label: 'Paid', icon: CheckCircle },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircle },
    completed: { color: 'bg-indigo-100 text-indigo-800', label: 'Completed', icon: CheckCircle },
  };
  
  const badge = statuses[status] || statuses.pending;
  const Icon = badge.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {badge.label}
    </span>
  );
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCustomerBookings(); 
      if (result.success && Array.isArray(result.data)) { // Pastikan data adalah array
        setBookings(result.data);
      } else if (!result.success) {
        setError(result.message || 'Gagal mengambil data booking.');
      } else {
        // Jika success tapi data bukan array (misal null atau format salah)
        setError('Format data booking tidak valid.');
        setBookings([]); // Kosongkan data
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
      setBookings([]); // Kosongkan data jika error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Card className="inline-block p-6 border-red-200 bg-red-50">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="font-semibold text-red-700">Gagal Memuat Data</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
          >
            Coba Lagi
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 pt-20">Booking Saya</h1>
      {bookings.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-600">Anda belum memiliki riwayat booking.</p>
          {/* Tambahkan tombol untuk mencari venue */}
          <Link href="/venues" className="mt-4 inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm">
            Cari Lapangan Sekarang
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.field?.venue?.name || 'Venue Tidak Tersedia'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.field?.name || 'Lapangan Tidak Tersedia'}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                    <div>
                      <p className="text-gray-500">No. Booking</p>
                      <p className="font-medium text-gray-800 break-words">{booking.booking_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tanggal Main</p>
                      <p className="font-medium text-gray-800">{formatDate(booking.booking_date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Jam</p>
                      <p className="font-medium text-gray-800">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <span className="text-lg font-bold text-orange-600 mb-2 sm:mb-0">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(booking.total_amount)}
                </span>
                <span className="text-xs text-gray-500">
                  Dipesan pada: {format(new Date(booking.created_at), 'dd/MM/yy HH:mm')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}