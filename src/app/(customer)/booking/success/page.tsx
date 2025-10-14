'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Calendar, Clock, MapPin, Phone, Mail, Loader } from 'lucide-react'
import { getBookingStatus } from '@/lib/api'

export default function BookingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const orderID = searchParams.get('order_id')

  useEffect(() => {
    if (orderID) {
      loadBookingStatus()
    } else {
      setLoading(false)
    }
  }, [orderID])

  const loadBookingStatus = async () => {
    try {
      const result = await getBookingStatus(orderID!)
      
      if (result.success && result.data) {
        setBooking(result.data)
      }
    } catch (error) {
      console.error('Failed to load booking status:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <button
            onClick={() => router.push('/venues')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg"
          >
            Kembali ke Daftar Lapangan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h1>
          <p className="text-gray-600">
            {booking.status === 'paid' 
              ? 'Pembayaran telah dikonfirmasi.' 
              : 'Booking Anda telah dibuat. Silakan selesaikan pembayaran.'}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600">Nomor Booking</div>
            <div className="text-xl font-bold text-orange-600">{booking.booking_number}</div>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                booking.status === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status === 'paid' ? 'Lunas' : 'Menunggu Pembayaran'}
              </span>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium">{booking.field?.venue?.name}</div>
                <div className="text-sm text-gray-600">{booking.field?.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">
                  {new Date(booking.booking_date).toLocaleDateString('id-ID', {
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
                <div className="font-medium">
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(booking.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Biaya Admin</span>
              <span>{formatCurrency(booking.admin_fee)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
              <span>Total Bayar</span>
              <span className="text-orange-600">{formatCurrency(booking.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {booking.status !== 'paid' && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-orange-800 mb-2">Instruksi Pembayaran</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p>• Selesaikan pembayaran Anda melalui Midtrans</p>
              <p>• Simpan nomor booking untuk referensi</p>
              <p>• Konfirmasi otomatis setelah pembayaran berhasil</p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h3 className="font-bold mb-3">Informasi Kontak</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{booking.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{booking.customer_email}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.open(
              `https://wa.me/6281234567890?text=Halo, saya ingin konfirmasi booking dengan nomor ${booking.booking_number}`, 
              '_blank'
            )}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Hubungi via WhatsApp
          </button>
          
          <button
            onClick={() => router.push('/venues')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Kembali ke Daftar Lapangan
          </button>
        </div>
      </div>
    </div>
  )
}