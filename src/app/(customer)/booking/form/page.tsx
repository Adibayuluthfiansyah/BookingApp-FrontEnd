'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, User, Phone, Mail, MessageSquare, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { createBooking } from '@/lib/api'
import Script from 'next/script'
import { useAuth } from '@/app/contexts/AuthContext' // <-- 1. Import useAuth

declare global {
  interface Window {
    snap: any;
  }
}

interface BookingData {
  fieldId: number
  fieldName: string
  venueId: number
  venueName: string
  timeSlotId: number
  startTime: string
  endTime: string
  date: string
  price: number
}

export default function BookingFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth() // <-- 2. Gunakan hook useAuth

  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [snapLoaded, setSnapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadBookingData()

    // --- 3. PERBAIKAN: Isi form jika user sudah login ---
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
        // Pastikan model User Anda punya 'phone', jika tidak, hapus baris ini
        customerPhone: user.phone || '' 
      }))
    }
    // --- AKHIR PERBAIKAN ---

  }, [user]) // <-- 4. Tambahkan 'user' sebagai dependency

  const loadBookingData = () => {
    try {
      const savedData = sessionStorage.getItem('bookingData')
      
      if (!savedData) {
        console.error('No booking data found')
        setError('Data booking tidak ditemukan. Silakan pilih slot lagi.')
        setTimeout(() => router.push('/venues'), 2000)
        return
      }

      const data = JSON.parse(savedData)
      console.log('Loaded booking data:', data)

      // Validate required fields (cek harga juga)
      if (!data.timeSlotId || !data.fieldId || !data.date || data.price === undefined || data.price === null) {
        console.error('Invalid booking data:', data)
        setError('Data booking tidak lengkap. Silakan pilih slot lagi.')
        sessionStorage.removeItem('bookingData')
        setTimeout(() => router.push('/venues'), 2000)
        return
      }

      setBookingData(data)
    } catch (error) {
      console.error('Error loading booking data:', error)
      setError('Error memuat data booking.')
      setTimeout(() => router.push('/venues'), 2000)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      errors.customerName = 'Nama lengkap wajib diisi'
    } else if (formData.customerName.trim().length < 3) {
      errors.customerName = 'Nama minimal 3 karakter'
    }

    if (!formData.customerPhone.trim()) {
      errors.customerPhone = 'Nomor telepon wajib diisi'
    } else if (!/^08\d{8,11}$/.test(formData.customerPhone.trim())) {
      errors.customerPhone = 'Format nomor telepon tidak valid (contoh: 08123456789)'
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      errors.customerEmail = 'Format email tidak valid'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('=== FORM SUBMIT STARTED ===')
    
    // Validate form
    if (!validateForm()) {
      console.log('Validation failed:', validationErrors)
      return
    }

    if (!snapLoaded) {
      setError('Sistem pembayaran masih loading. Mohon tunggu...')
      return
    }

    if (typeof window === 'undefined' || !window.snap) {
      setError('Sistem pembayaran belum siap. Silakan refresh halaman.')
      return
    }

    if (!bookingData) {
      setError('Data booking tidak ditemukan. Silakan pilih slot lagi.')
      router.push('/venues')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const bookingPayload = {
        field_id: Number(bookingData.fieldId),
        time_slot_id: Number(bookingData.timeSlotId),
        booking_date: bookingData.date,
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        customer_email: formData.customerEmail.trim(),
        notes: formData.notes.trim() || undefined,
      }

      console.log('=== SUBMITTING BOOKING ===')
      console.log('Payload:', bookingPayload)

      const result = await createBooking(bookingPayload)

      console.log('=== BOOKING RESULT ===', result)

      if (result.success && result.data) {
        const { snap_token, booking } = result.data

        console.log('=== OPENING SNAP PAYMENT ===')
        console.log('Snap Token:', snap_token)
        console.log('Booking Number:', booking.booking_number)

        window.snap.pay(snap_token, {
          onSuccess: function(result: any) {
            console.log('=== PAYMENT SUCCESS ===', result)
            sessionStorage.removeItem('bookingData')
            router.push(`/booking/success?order_id=${booking.booking_number}`)
          },
          onPending: function(result: any) {
            console.log('=== PAYMENT PENDING ===', result)
            sessionStorage.removeItem('bookingData')
            router.push(`/booking/success?order_id=${booking.booking_number}`)
          },
          onError: function(result: any) {
            console.error('=== PAYMENT ERROR ===', result)
            setError('Pembayaran gagal. Silakan coba lagi.')
            setIsLoading(false)
          },
          onClose: function() {
            console.log('=== PAYMENT POPUP CLOSED ===')
            setIsLoading(false)
          }
        })

      } else {
        // Tangani error dari API, termasuk jika token tidak valid
        const errorMessage = result.message || 'Gagal membuat booking. Silakan coba lagi.'
        console.error('=== BOOKING FAILED ===', errorMessage)
        setError(errorMessage)
        // Jika error adalah autentikasi, mungkin perlu redirect ke login
        if (errorMessage.includes('Autentikasi gagal')) {
           // Contoh: setTimeout(() => router.push('/login'), 2000);
        }
        setIsLoading(false)
      }

    } catch (error) {
      console.error('=== BOOKING EXCEPTION ===', error)
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.'
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (time: string) => {
    return time ? time.substring(0, 5) : '-' // Tambah pengecekan null/undefined
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-' // Tambah pengecekan null/undefined
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return 'Invalid Date';
    }
  }

  // Loading or error state
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
        <div className="text-xl">Memuat data booking...</div>
      </div>
    )
  }

  const adminFee = 5000
  const totalAmount = (bookingData.price || 0) + adminFee // Pastikan price ada nilainya

  return (
    <>
      {/* Midtrans Snap Script */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        // --- 5. PERBAIKAN: Gunakan strategy yang tepat ---
        strategy="afterInteractive" 
        // --- AKHIR PERBAIKAN ---
        onLoad={() => {
          console.log('=== MIDTRANS SCRIPT LOADED ===')
          // --- 6. PERBAIKAN: Hapus setTimeout, cek langsung ---
          if (typeof window !== 'undefined' && window.snap) {
            console.log('✅ window.snap is AVAILABLE')
            setSnapLoaded(true)
          } else {
            console.error('❌ window.snap is NOT AVAILABLE after onLoad')
            // Coba lagi setelah delay singkat, sebagai fallback
            setTimeout(() => {
              if (typeof window !== 'undefined' && window.snap) {
                console.log('✅ window.snap is AVAILABLE after delay')
                setSnapLoaded(true)
              } else {
                 console.error('❌ window.snap still NOT AVAILABLE')
                 setError('Gagal memuat sistem pembayaran. Silakan refresh halaman.')
              }
            }, 300); // Delay singkat
          }
          // --- AKHIR PERBAIKAN ---
        }}
        onError={(e) => { // Tambah parameter error
          console.error('=== MIDTRANS SCRIPT ERROR ===', e)
          setError('Gagal memuat script pembayaran Midtrans. Periksa koneksi internet atau coba refresh.')
        }}
      />

      <div className="min-h-screen pt-16 bg-gray-50">
        {/* Header */}
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

        {/* Error Alert */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Snap Status */}
        <div className="max-w-4xl mx-auto px-4 pt-2">
          <div className={`text-xs p-2 rounded flex items-center gap-2 ${
            snapLoaded ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
          }`}>
            {snapLoaded ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-spin" />}
            <span>Status Pembayaran: {snapLoaded ? 'Siap' : 'Loading...'}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pemesan
                </h2>

                <div className="space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.customerName ? 'border-red-300' : ''
                        }`}
                        placeholder="Masukkan nama lengkap"
                        required // Tambah required HTML5
                      />
                    </div>
                    {validationErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.customerName}</p>
                    )}
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.customerPhone ? 'border-red-300' : ''
                        }`}
                        placeholder="08xxxxxxxxxx"
                        required // Tambah required HTML5
                      />
                    </div>
                    {validationErrors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.customerPhone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.customerEmail ? 'border-red-300' : ''
                        }`}
                        placeholder="email@example.com"
                        required // Tambah required HTML5
                      />
                    </div>
                    {validationErrors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.customerEmail}</p>
                    )}
                  </div>

                  {/* Catatan */}
                  <div>
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
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Metode Pembayaran
                  </h3>
                  <p className="text-sm text-blue-700">
                    Anda akan diarahkan ke halaman pembayaran Midtrans setelah mengklik tombol di bawah. 
                    Pilih metode pembayaran yang Anda inginkan (Transfer Bank, E-Wallet, Kartu Kredit, dll).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !snapLoaded}
                  className="w-full mt-6 bg-orange-500 text-white py-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : !snapLoaded ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Loading Payment System...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Lanjutkan ke Pembayaran
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Ringkasan Booking</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Venue</div>
                    <div className="font-medium">{bookingData.venueName || '-'}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Lapangan</div>
                    <div className="font-medium">{bookingData.fieldName || '-'}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Tanggal</div>
                      <div className="font-medium">{formatDate(bookingData.date)}</div>
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
                    <span className="font-medium">{formatCurrency(bookingData.price || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Biaya Admin</span>
                    <span className="font-medium">{formatCurrency(adminFee)}</span>
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