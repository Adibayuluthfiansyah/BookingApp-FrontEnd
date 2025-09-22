'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, MapPin, Star, Share2, Instagram, Facebook, Clock, Check, X } from 'lucide-react'
import { MOCK_VENUES, MOCK_TIME_SLOTS, formatCurrency, formatTime } from '@/lib/utils'
import { Venue, TimeSlot } from '@/types'
import { BookingSlot } from '@/types'

export default function VenueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const venueId = parseInt(params.id as string)
  
  const [venue, setVenue] = useState<Venue | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedField, setSelectedField] = useState<number | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<BookingSlot[]>([])
  const [activeTab, setActiveTab] = useState<'schedule' | 'gallery' | 'about'>('schedule')

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayNamesID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      
      dates.push({
        date: date.toISOString().split('T')[0],
        dayName: dayNamesID[date.getDay()],
        dayNumber: date.getDate(),
        isToday: i === 0
      })
    }
    return dates
  }

  const [dates] = useState(generateDates())

  useEffect(() => {
    const foundVenue = MOCK_VENUES.find(v => v.id === venueId)
    if (foundVenue) {
      setVenue(foundVenue)
      setSelectedDate(dates[0].date)
      setSelectedField(foundVenue.fields[0]?.id || null)
    }
  }, [venueId])

  const handleSlotClick = (timeSlot: TimeSlot) => {
    if (!timeSlot.is_available || !selectedField || !selectedDate) return

    const fieldName = venue?.fields.find(f => f.id === selectedField)?.name || ''
    
    const bookingSlot: BookingSlot = {
      date: selectedDate,
      timeSlot,
      fieldId: selectedField,
      fieldName
    }

    const existingIndex = selectedSlots.findIndex(
      slot => slot.date === selectedDate && 
               slot.timeSlot.id === timeSlot.id && 
               slot.fieldId === selectedField
    )

    if (existingIndex >= 0) {
      setSelectedSlots(selectedSlots.filter((_, index) => index !== existingIndex))
    } else {
      setSelectedSlots([...selectedSlots, bookingSlot])
    }
  }

  const isSlotSelected = (timeSlot: TimeSlot) => {
    return selectedSlots.some(
      slot => slot.date === selectedDate && 
               slot.timeSlot.id === timeSlot.id && 
               slot.fieldId === selectedField
    )
  }

  const getTotalPrice = () => {
    return selectedSlots.reduce((total, slot) => total + slot.timeSlot.price, 0)
  }

  const handleBooking = () => {
    if (selectedSlots.length === 0) {
      alert('Silakan pilih jadwal terlebih dahulu')
      return
    }
    
    // Navigate to booking form with selected slots
    const bookingData = {
      venueId,
      slots: selectedSlots,
      totalPrice: getTotalPrice()
    }
    
    // Store in localStorage temporarily
    localStorage.setItem('bookingData', JSON.stringify(bookingData))
    router.push('/booking/form')
  }

  if (!venue) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 md:h-80">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Share Button */}
        <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Venue Info */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="text-red-500 font-medium mb-2">{venue.name}</div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{venue.rating}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{venue.address}</span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white p-2 rounded">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="bg-pink-500 text-white p-2 rounded">
                  <Instagram className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-orange-50 p-4 rounded-lg md:w-80">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Pilih Tanggal Booking :</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Pilih Lapangan :</label>
                <select
                  value={selectedField || ''}
                  onChange={(e) => setSelectedField(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {venue.fields.map(field => (
                    <option key={field.id} value={field.id}>{field.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Cari Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'schedule' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              SCHEDULE
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'gallery' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              GALLERY
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'about' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ABOUT
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'schedule' && (
          <div>
            {/* Date Selector */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`p-3 text-center rounded-lg border transition-colors ${
                    selectedDate === date.date
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="text-sm font-medium">{date.dayNumber} {date.date.split('-')[1]}</div>
                  <div className="text-xs">{date.dayName}</div>
                  {date.isToday && <div className="text-xs text-orange-500 font-medium">Today</div>}
                </button>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {MOCK_TIME_SLOTS.map((slot) => {
                const isAvailable = slot.is_available
                const isSelected = isSlotSelected(slot)
                
                return (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!isAvailable}
                    className={`p-4 rounded-lg text-center transition-all ${
                      !isAvailable
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isSelected ? (
                        <Check className="w-4 h-4" />
                      ) : !isAvailable ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </div>
                    <div className="text-xs mt-1">
                      {formatCurrency(slot.price)}
                    </div>
                    <div className="text-xs mt-1 font-medium">
                      {isAvailable ? (isSelected ? 'Terpilih' : 'Available') : 'Booked'}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Selected Slots Summary */}
            {selectedSlots.length > 0 && (
              <div className="mt-6 bg-white rounded-lg border p-4">
                <h3 className="font-medium mb-3">Jadwal Terpilih:</h3>
                <div className="space-y-2">
                  {selectedSlots.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {slot.fieldName} - {formatTime(slot.timeSlot.start_time)}-{formatTime(slot.timeSlot.end_time)}
                      </span>
                      <span className="font-medium">{formatCurrency(slot.timeSlot.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Lanjutkan Booking
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock Gallery Images */}
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={venue.image}
                  alt={`Gallery ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Tentang {venue.name}</h3>
            <p className="text-gray-700 mb-6">{venue.description}</p>
            
            <h4 className="font-bold mb-3">Fasilitas:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {venue.facilities.map((facility, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}