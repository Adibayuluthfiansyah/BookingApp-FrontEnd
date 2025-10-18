'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  FileText
} from 'lucide-react';
import { getAdminBookingDetail, updateAdminBookingStatus } from '@/lib/api';
import { Booking } from '@/types';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      loadBookingDetail();
    }
  }, [params.id]);

  const loadBookingDetail = async () => {
    try {
      setLoading(true);
      const result = await getAdminBookingDetail(Number(params.id));
      
      if (result.success && result.data) {
        setBooking(result.data);
        setSelectedStatus(result.data.status);
      }
    } catch (error) {
      console.error('Error loading booking detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!booking) return;

    try {
      setUpdating(true);
      
      const result = await updateAdminBookingStatus(booking.id, {
        status: selectedStatus,
        notes: adminNotes
      });

      if (result.success) {
        alert('Status booking berhasil diupdate!');
        setShowStatusModal(false);
        setAdminNotes('');
        loadBookingDetail(); // Reload data
      } else {
        alert('Gagal update status: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat update status');
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; bg: string; label: string; icon: any }> = {
      pending: { color: 'text-yellow-800', bg: 'bg-yellow-100', label: 'Pending', icon: Clock },
      confirmed: { color: 'text-green-800', bg: 'bg-green-100', label: 'Confirmed', icon: CheckCircle },
      cancelled: { color: 'text-red-800', bg: 'bg-red-100', label: 'Cancelled', icon: XCircle },
      completed: { color: 'text-blue-800', bg: 'bg-blue-100', label: 'Completed', icon: CheckCircle },
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="w-5 h-5" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Booking tidak ditemukan</p>
          <button
            onClick={() => router.push('/admin/bookings')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Kembali ke List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/bookings')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detail Booking #{booking.booking_number}
                </h1>
                <p className="text-gray-600 mt-1">
                  Dibuat pada {formatDateTime(booking.created_at)}
                </p>
              </div>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Informasi Customer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nama Lengkap</label>
                  <p className="font-medium text-gray-900 mt-1">{booking.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">No. Telepon</label>
                  <p className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {booking.customer_phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium text-gray-900 mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {booking.customer_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Detail Booking
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Venue & Lapangan</label>
                    <p className="font-medium text-gray-900 mt-1">
                      {booking.field?.venue?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.field?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Tanggal Main</label>
                    <p className="font-medium text-gray-900 mt-1">
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Waktu Main</label>
                    <p className="font-medium text-gray-900 mt-1">
                      {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)} WIB
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Catatan</label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                        {booking.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                Rincian Pembayaran
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Harga Sewa</span>
                  <span className="font-medium">{formatCurrency(booking.subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Biaya Admin</span>
                  <span className="font-medium">{formatCurrency(booking.admin_fee)}</span>
                </div>
                <div className="flex justify-between py-3 pt-4 border-t-2">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(booking.total_amount)}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status Pembayaran:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.payment?.payment_status === 'verified' 
                      ? 'bg-green-100 text-green-800'
                      : booking.payment?.payment_status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.payment?.payment_status === 'verified' ? 'Terbayar' :
                     booking.payment?.payment_status === 'rejected' ? 'Ditolak' : 'Pending'}
                  </span>
                </div>
                {booking.payment?.paid_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Dibayar pada: {formatDateTime(booking.payment.paid_at)}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Metode: {booking.payment?.payment_method || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Update Status
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Booking
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Admin (Opsional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Tambahkan catatan jika diperlukan..."
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || selectedStatus === booking.status}
                  className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Mengupdate...' : 'Update Status'}
                </button>

                {selectedStatus !== booking.status && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800">
                      Status akan berubah dari <strong>{booking.status}</strong> ke <strong>{selectedStatus}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Booking Number</label>
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {booking.booking_number}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Dibuat Pada</label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(booking.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Update Terakhir</label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(booking.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}