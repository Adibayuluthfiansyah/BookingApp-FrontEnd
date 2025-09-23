'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react'

export default function BookingSuccessPage() {
  const router = useRouter()
  
  // Mock booking data - in real app, this would come from API or props
  const bookingDetails = {
    bookingId: 'KSH' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    venueName: 'Arena Mini Soccer Plus',
    fieldName: 'Lapangan 1',
    date: '2025-09-23',
    timeSlots: ['08:00-10:00', '10:00-12:00'],
    totalPrice: 400000,
    customerName: 'John Doe',
    customerPhone: '08123456789',
    paymentMethod: 'Transfer Bank'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h1>
          <p className="text-gray-600">
            Terima kasih! Booking Anda telah berhasil dibuat.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600">Nomor Booking</div>
            <div className="text-xl font-bold text-orange-600">{bookingDetails.bookingId}</div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium">{bookingDetails.venueName}</div>
                <div className="text-sm text-gray-600">{bookingDetails.fieldName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">
                  {new Date(bookingDetails.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">{bookingDetails.timeSlots.join(', ')}</div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Bayar:</span>
              <span className="text-orange-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(bookingDetails.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-orange-800 mb-2">Instruksi Pembayaran</h3>
          <div className="text-sm text-orange-700 space-y-1">
            <p>• Silakan lakukan pembayaran sesuai metode yang dipilih</p>
            <p>• Simpan nomor booking untuk referensi</p>
            <p>• Konfirmasi pembayaran akan dikirim via WhatsApp</p>
            <p>• Datang 15 menit sebelum jadwal bermain</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-bold mb-3">Informasi Kontak</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>info@kashmirbooking.com</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.open(`https://wa.me/6281234567890?text=Halo, saya ingin konfirmasi booking dengan nomor ${bookingDetails.bookingId}`, '_blank')}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Konfirmasi via WhatsApp
          </button>
          
          <button
            onClick={() => router.push('/venues')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Kembali ke Daftar Lapangan
          </button>
          
          <button
            onClick={() => router.push('/booking/history')}
            className="w-full text-orange-600 py-2 font-medium hover:text-orange-700 transition-colors"
          >
            Lihat Riwayat Booking
          </button>
        </div>
      </div>
    </div>
  )
}