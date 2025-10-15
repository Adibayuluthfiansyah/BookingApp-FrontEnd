'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, MessageSquare, Calendar, Clock, AlertCircle } from 'lucide-react'
import { createBooking } from '@/lib/api'
import Script from 'next/script'

declare global {
  interface Window {
    snap: any;
  }
}

export default function BookingFormPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadBookingData()
  }, [router])

 const loadBookingData = async () => {
  try {
    const savedBookingData = sessionStorage.getItem('bookingData')
    
    if (!savedBookingData) {
      console.error('No booking data found')
      router.push('/venues')
      return
    }

    const data = JSON.parse(savedBookingData)
    console.log('Loaded booking data:', data)

    // VALIDASI CRITICAL
    if (!data.timeSlotId || !data.fieldId || !data.date) {
      console.error('Invalid booking data:', data)
      setError('Data booking tidak lengkap. Silakan pilih slot lagi.')
      sessionStorage.removeItem('bookingData')
      
      setTimeout(() => {
        router.push('/venues')
      }, 2000)
      return
    }

    // VALIDASI: Cek apakah ID adalah number yang valid
    const timeSlotId = Number(data.timeSlotId)
    const fieldId = Number(data.fieldId)

    if (isNaN(timeSlotId) || isNaN(fieldId) || timeSlotId <= 0 || fieldId <= 0) {
      console.error('Invalid ID values:', { timeSlotId, fieldId })
      setError('ID slot tidak valid. Silakan pilih slot lagi.')
      sessionStorage.removeItem('bookingData')
      
      setTimeout(() => {
        router.push('/venues')
      }, 2000)
      return
    }

    // 🔥 VALIDASI PENTING: Cek ke backend apakah time slot masih ada
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
      const response = await fetch(`${API_BASE_URL}/time-slots/${timeSlotId}/validate`, {
        headers: {
          'Accept': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Time slot tidak ditemukan')
      }
      
      const result = await response.json()
      console.log('Time slot validated:', result)
      
      if (!result.success) {
        throw new Error(result.message || 'Time slot tidak valid')
      }
    } catch (err) {
      console.error('Time slot validation failed:', err)
      setError('Slot yang dipilih sudah tidak tersedia. Silakan pilih slot lain.')
      sessionStorage.removeItem('bookingData')
      
      setTimeout(() => {
        router.push('/venues')
      }, 2000)
      return
    }

    // VALIDASI: Cek timestamp (max 30 menit)
    const savedAt = data.savedAt || Date.now()
    const thirtyMinutes = 30 * 60 * 1000
    
    if (Date.now() - savedAt > thirtyMinutes) {
      console.error('Booking data expired')
      setError('Data booking sudah kadaluarsa. Silakan pilih slot lagi.')
      sessionStorage.removeItem('bookingData')
      
      setTimeout(() => {
        router.push('/venues')
      }, 2000)
      return
    }

    setBookingData(data)
  } catch (error) {
    console.error('Error loading booking data:', error)
    setError('Error memuat data booking.')
    sessionStorage.removeItem('bookingData')
    
    setTimeout(() => {
      router.push('/venues')
    }, 2000)
  }
}

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!snapLoaded) {
      alert('Payment system is still loading. Please wait...')
      return
    }

    if (!bookingData) {
      alert('Data booking tidak ditemukan. Silakan pilih slot lagi.')
      router.push('/venues')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert ke number untuk memastikan
      const fieldId = Number(bookingData.fieldId)
      const timeSlotId = Number(bookingData.timeSlotId)

      // Validasi lagi sebelum submit
      if (isNaN(fieldId) || isNaN(timeSlotId) || fieldId <= 0 || timeSlotId <= 0) {
        throw new Error('Data booking tidak valid. ID field atau time slot salah.')
      }

      const bookingPayload = {
        field_id: fieldId,
        time_slot_id: timeSlotId,
        booking_date: bookingData.date,
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        customer_email: formData.customerEmail.trim(),
        notes: formData.notes.trim(),
      }

      console.log('Submitting booking with payload:', bookingPayload)

      const result = await createBooking(bookingPayload)

      console.log('Booking result:', result)

      if (result.success && result.data) {
        const { snap_token, booking } = result.data

        window.snap.pay(snap_token, {
          onSuccess: function(result: any) {
            console.log('Payment success:', result)
            sessionStorage.removeItem('bookingData')
            router.push(`/booking/success?order_id=${booking.booking_number}`)
          },
          onPending: function(result: any) {
            console.log('Payment pending:', result)
            sessionStorage.removeItem('bookingData')
            router.push(`/booking/success?order_id=${booking.booking_number}`)
          },
          onError: function(result: any) {
            console.error('Payment error:', result)
            alert('Pembayaran gagal. Silakan coba lagi.')
            setIsLoading(false)
          },
          onClose: function() {
            console.log('Payment popup closed')
            setIsLoading(false)
          }
        })
      } else {
        const errorMessage = result.message || 'Gagal membuat booking. Silakan coba lagi.'
        setError(errorMessage)
        
        // Jika error terkait time slot tidak valid, redirect
        if (errorMessage.toLowerCase().includes('time slot') || 
            errorMessage.toLowerCase().includes('tidak ditemukan') ||
            errorMessage.toLowerCase().includes('tidak valid')) {
          sessionStorage.removeItem('bookingData')
          setTimeout(() => {
            router.push('/venues')
          }, 3000)
        }
        
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Booking failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  // Show error state
  if (error && !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Mengalihkan ke halaman venue...</p>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const adminFee = 5000
  const totalAmount = bookingData.price + adminFee

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => {
          console.log('Midtrans Snap loaded')
          setSnapLoaded(true)
        }}
        onError={() => {
          console.error('Failed to load Midtrans Snap')
          alert('Gagal memuat sistem pembayaran')
        }}
      />

      <div className="min-h-screen pt-15 bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Form Booking</h1>
              <p className="text-gray-600 text-sm">Lengkapi data untuk melanjutkan booking</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pemesan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                      placeholder="Masukkan catatan jika ada (opsional)"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-blue-800 mb-2">Metode Pembayaran</h3>
                  <p className="text-sm text-blue-700">
                    Anda akan diarahkan ke halaman pembayaran Midtrans setelah mengklik tombol di bawah. 
                    Pilih metode pembayaran yang Anda inginkan (Transfer Bank, E-Wallet, Kartu Kredit, dll).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !snapLoaded}
                  className="w-full bg-orange-500 text-white py-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Memproses...' : !snapLoaded ? 'Loading Payment System...' : 'Lanjutkan ke Pembayaran'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Ringkasan Booking</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Venue</div>
                    <div className="font-medium">{bookingData.venueName}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Lapangan</div>
                    <div className="font-medium">{bookingData.fieldName}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Tanggal</div>
                      <div className="font-medium">
                        {new Date(bookingData.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Waktu</div>
                      <div className="font-medium">
                        {formatTime(bookingData.startTime)} - {formatTime(bookingData.endTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Harga Sewa</span>
                    <span>{formatCurrency(bookingData.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span>{formatCurrency(adminFee)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                    <span>Total Bayar</span>
                    <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="text-xs text-orange-800">
                    <strong>Catatan:</strong> Booking akan dikonfirmasi setelah pembayaran berhasil. 
                    Silakan simpan nomor booking untuk referensi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}