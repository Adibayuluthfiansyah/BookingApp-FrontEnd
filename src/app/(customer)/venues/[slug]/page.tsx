'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getVenue, getAvailableSlots } from '@/lib/api';
import { Venue, Field, TimeSlot } from '@/types';
import { format, addDays } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { MapPin, Facebook, Instagram, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'gallery' | 'about'>('schedule');
  
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = addDays(today, i);
        datesArray.push(date);
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  useEffect(() => {
    if (params.slug) {
      loadVenue();
    }
  }, [params.slug]);

  useEffect(() => {
    if (selectedField && selectedDate && venue) {
      loadAvailableSlots();
    }
  }, [selectedField, selectedDate]);

  const loadVenue = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gunakan ID dari params
      const venueId = params.slug as string;
      console.log('Loading venue with ID:', venueId);
      
      const result = await getVenue(venueId);
      console.log('Venue result:', result);
      
      if (result.success && result.data) {
        setVenue(result.data);
        
        // Set default field
        if (result.data.fields && result.data.fields.length > 0) {
          setSelectedField(result.data.fields[0]);
        }
      } else {
        setError(result.message || 'Venue tidak ditemukan');
      }
    } catch (error) {
      console.error('Error loading venue:', error);
      setError('Gagal memuat data venue');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!venue || !selectedField) return;

    try {
      setSlotsLoading(true);
      const result = await getAvailableSlots(venue.id, {
        field_id: selectedField.id,
        date: selectedDate,
      });
      
      if (result.success) {
        setAvailableSlots(result.data);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    if (!selectedSlot || !selectedField || !venue) return;

    const bookingData = {
      venueId: venue.id,
      venueName: venue.name,
      fieldId: selectedField.id,
      fieldName: selectedField.name,
      date: selectedDate,
      timeSlotId: selectedSlot.id,
      startTime: selectedSlot.start_time,
      endTime: selectedSlot.end_time,
      price: selectedSlot.price,
      savedAt: Date.now(), // Tambahkan timestamp
    };

    console.log('Saving booking data to sessionStorage:', bookingData);
    sessionStorage.removeItem('bookingData');
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/booking/form');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Memuat data venue...</div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">{error || 'Venue tidak ditemukan'}</div>
        <button 
          onClick={() => router.push('/venues')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Kembali ke Daftar Lapangan
        </button>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          {/* Main Image */}
          {venue.image_url && (
            <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <Image 
                src={venue.image_url} 
                alt={venue.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{venue.address}</span>
              </div>
              <p className="mt-3 text-gray-700">{venue.description}</p>

              {/* Social Media Links */}
              <div className="flex gap-2 mt-4">
                {venue.facebook_url && (
                  <a
                    href={venue.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {venue.instagram_url && (
                  <a
                    href={venue.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'schedule'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              JADWAL
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'gallery'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              GALERI
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === 'about'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              TENTANG
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'schedule' && (
              <div>
                {/* Date Selector */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="grid grid-cols-7 gap-2">
                    {dates.map((date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const isSelected = dateStr === selectedDate;
                      const dayName = format(date, 'EEE', { locale: localeId });
                      const dayNumber = format(date, 'd');
                      const month = format(date, 'MMM', { locale: localeId });

                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 rounded-lg text-center transition ${
                            isSelected
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className="text-xs">{dayName}</div>
                          <div className="text-lg font-bold">{dayNumber}</div>
                          <div className="text-xs">{month}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Field Selector */}
                {venue.fields && venue.fields.length > 1 && (
                  <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <h3 className="font-semibold mb-3">Pilih Lapangan:</h3>
                    <div className="flex gap-2 flex-wrap">
                      {venue.fields.map((field) => (
                        <button
                          key={field.id}
                          onClick={() => setSelectedField(field)}
                          className={`px-4 py-2 rounded-lg transition ${
                            selectedField?.id === field.id
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {field.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slots */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold mb-4">Jadwal Tersedia:</h3>
                  
                  {slotsLoading ? (
                    <div className="text-center py-8">Memuat jadwal...</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Tidak ada slot tersedia untuk tanggal ini
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotClick(slot)}
                          className={`p-4 rounded-lg border-2 transition ${
                            selectedSlot?.id === slot.id
                              ? 'border-orange-600 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="font-semibold">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{formatPrice(slot.price)}</div>
                          <div className="flex items-center justify-center mt-2 text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-xs">Tersedia</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-4">Galeri</h3>
                {venue.images && venue.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.images.map((image) => (
                      <div key={image.id} className="relative h-48">
                        <Image
                          src={image.image_url}
                          alt={image.caption || venue.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada foto galeri
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold mb-4">Tentang Venue</h3>
                <p className="text-gray-700 mb-4">{venue.description}</p>
                
                <h4 className="font-semibold mb-2">Fasilitas:</h4>
                {venue.facilities && venue.facilities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities.map((facility) => (
                      <span
                        key={facility.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {facility.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Tidak ada informasi fasilitas</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4">Ringkasan Booking</h3>

              {selectedSlot && selectedField ? (
                <>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lapangan:</span>
                      <span className="font-medium">{selectedField.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-medium">
                        {format(new Date(selectedDate), 'dd MMM yyyy', { locale: localeId })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Waktu:</span>
                      <span className="font-medium">
                        {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-orange-600 text-lg">
                        {formatPrice(selectedSlot.price)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                  >
                    Lanjutkan Booking
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Pilih tanggal dan jadwal untuk melanjutkan
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}