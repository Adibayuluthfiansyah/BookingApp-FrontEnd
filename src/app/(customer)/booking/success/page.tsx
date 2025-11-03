"use client";

import React, { useEffect, useState, useCallback } from "react"; 
import { useRouter, useSearchParams } from "next/navigation";
import {CheckCircle, Clock, XCircle,Home,FileText,} from "lucide-react";
import { getBookingStatus } from "@/lib/api";
import { Booking } from "@/types"; 

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [booking, setBooking] = useState<Booking | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchBookingStatus = useCallback(async () => {
    if (!orderId) { 
      setError("Order ID tidak ditemukan");
      setLoading(false);
      return;
    }

    try {
      const result = await getBookingStatus(orderId);

      if (result.success && result.data) {
        setBooking(result.data);
        console.log("Booking status updated:", result.data);
      } else {
        setError("Booking tidak ditemukan");
      }
    } catch (error: unknown) { // PERBAIKAN: Ganti (error) dengan (error: unknown)
      // PERBAIKAN: Gunakan variabel error
      const message =
        error instanceof Error ? error.message : "Gagal mengambil status booking";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]); // 'orderId' adalah dependency dari fungsi ini

  useEffect(() => {
    if (orderId) {
      fetchBookingStatus();
      // Auto refresh status setiap 5 detik untuk 30 detik pertama
      const interval = setInterval(() => {
        fetchBookingStatus();
      }, 5000);

      // Stop auto refresh after 30 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 30000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setError("Order ID tidak ditemukan");
      setLoading(false);
    }
    // PERBAIKAN: Tambahkan 'fetchBookingStatus' ke dependency array
  }, [orderId, fetchBookingStatus]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const getStatusInfo = () => {
    if (!booking) return null;

    const status = booking.status;
    const paymentStatus = booking.payment?.payment_status;

    console.log("Status check:", { status, paymentStatus });

    if (
      status === "confirmed" ||
      status === "paid" ||
      paymentStatus === "verified"
    ) {
      return {
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        title: "Pembayaran Berhasil!",
        message: "Booking Anda telah dikonfirmasi",
        color: "green",
        badge: "success",
      };
    } else if (status === "pending" && paymentStatus === "pending") {
      return {
        icon: <Clock className="w-16 h-16 text-yellow-500" />,
        title: "Menunggu Pembayaran",
        message: "Silakan selesaikan pembayaran Anda",
        color: "yellow",
        badge: "pending",
      };
    } else if (status === "cancelled" || paymentStatus === "rejected") {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: "Booking Dibatalkan",
        message: "Pembayaran tidak berhasil atau dibatalkan",
        color: "red",
        badge: "cancelled",
      };
    }

    // Default to pending if status unclear
    return {
      icon: <Clock className="w-16 h-16 text-yellow-500" />,
      title: "Memproses Pembayaran",
      message: "Status pembayaran sedang diverifikasi",
      color: "yellow",
      badge: "processing",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || "Booking tidak ditemukan"}</p>
          <button
            onClick={() => router.push("/venues")}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Kembali ke Venue
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          {statusInfo && (
            <>
              {statusInfo.icon}
              <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                {statusInfo.title}
              </h1>
              <p className="text-gray-600 mb-6">{statusInfo.message}</p>
            </>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Nomor Booking</div>
            <div className="text-2xl font-bold text-gray-900">
              {booking.booking_number}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Simpan nomor booking ini untuk referensi Anda
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Detail Booking</h2>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Venue</span>
              <span className="font-medium">
                {booking.field?.venue?.name}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Lapangan</span>
              <span className="font-medium">{booking.field?.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tanggal</span>
              <span className="font-medium">
                {formatDate(booking.booking_date)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Waktu</span>
              <span className="font-medium">
                {formatTime(booking.start_time)} -{" "}
                {formatTime(booking.end_time)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Nama Pemesan</span>
              <span className="font-medium">{booking.customer_name}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">No. Telepon</span>
              <span className="font-medium">{booking.customer_phone}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{booking.customer_email}</span>
            </div>

            {booking.notes && (
              <div className="py-2 border-b">
                <div className="text-gray-600 mb-1">Catatan</div>
                <div className="font-medium">{booking.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Rincian Pembayaran</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Harga Sewa</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Biaya Admin</span>
              <span>{formatCurrency(booking.admin_fee)}</span>
            </div>

            <div className="flex justify-between pt-2 border-t font-bold text-lg">
              <span>Total</span>
              <span className="text-orange-600">
                {formatCurrency(booking.total_amount)}
              </span>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Status Pembayaran</span>
                <span
                  className={`font-medium ${
                    booking.payment?.payment_status === "verified"
                      ? "text-green-600"
                      : booking.payment?.payment_status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {booking.payment?.payment_status === "verified"
                    ? "Terbayar"
                    : booking.payment?.payment_status === "pending"
                    ? "Menunggu"
                    : "Gagal"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/venues")}
            className="flex items-center justify-center gap-2 bg-white border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Kembali ke Home
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Cetak Booking
          </button>
        </div>
      </div>
    </div>
  );
}