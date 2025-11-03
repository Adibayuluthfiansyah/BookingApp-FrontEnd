"use client";

import {useState,useEffect,useCallback, } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVenue, getAvailableSlots } from "@/lib/api";
import { Venue, Field, TimeSlotWithStatus } from "@/types";
import { format, addDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {MapPin,Facebook,Instagram,Clock,CheckCircle,XCircle,} from "lucide-react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlotWithStatus[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotWithStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "gallery" | "about">(
    "schedule",
  );

  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const generateDates = () => {
      const datesArray = [];
      const today = new Date();
      for (let i = 0; i < 14; i++) {
        const date = addDays(today, i);
        datesArray.push(date);
      }
      setDates(datesArray);
    };
    generateDates();
  }, []);

  // Bungkus dengan useCallback
  const loadVenue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const venueId = params.slug as string;
      console.log("Loading venue with ID:", venueId);

      const result = await getVenue(venueId);
      console.log("Venue result:", result);

      if (result.success && result.data) {
        setVenue(result.data);

        if (result.data.fields && result.data.fields.length > 0) {
          setSelectedField(result.data.fields[0]);
        }
      } else {
        setError(result.message || "Venue tidak ditemukan");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error loading venue:", message);
      setError("Gagal memuat data venue");
    } finally {
      setLoading(false);
    }
  }, [params.slug]); // Dependency untuk useCallback

  // Bungkus dengan useCallback
  const loadAvailableSlots = useCallback(async () => {
    if (!venue || !selectedField) return;

    try {
      setSlotsLoading(true);

      console.log("=== FETCHING SLOTS WITH STATUS ===");
      console.log("Venue ID:", venue.id);
      console.log("Field ID:", selectedField.id);
      console.log("Date:", selectedDate);

      const result = await getAvailableSlots(venue.id, {
        field_id: selectedField.id,
        date: selectedDate,
      });

      console.log("=== API RESULT ===");
      console.log("Success:", result.success);
      console.log("Data:", result.data);
      console.log("Meta:", result.meta);

      if (result.success) {
        setAvailableSlots(result.data || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error: unknown) { 
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error loading slots:", message);
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [venue, selectedField, selectedDate]); // Dependencies untuk useCallback

  useEffect(() => {
    if (params.slug) {
      loadVenue();
    }
    // Tambahkan 'loadVenue' ke dependency array
  }, [params.slug, loadVenue]);

  useEffect(() => {
    if (selectedField && selectedDate && venue) {
      loadAvailableSlots();
    }
    //Tambahkan 'loadAvailableSlots' dan 'venue'
  }, [selectedField, selectedDate, venue, loadAvailableSlots]);

  const handleSlotClick = (slot: TimeSlotWithStatus) => {
    if (!slot.is_available) {
      alert("Slot ini sudah dibooking oleh orang lain");
      return;
    }
    console.log("Selected slot:", slot);
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    console.log("=== HANDLE BOOKING CLICKED ===");

    if (!selectedSlot || !selectedField || !venue) {
      console.error("❌ Missing required data");
      alert("Silakan pilih slot terlebih dahulu");
      return;
    }

    if (!selectedSlot.is_available) {
      alert("Slot ini sudah tidak tersedia");
      return;
    }

    const slotId = Number(selectedSlot.id);
    const fieldId = Number(selectedField.id);

    console.log("Slot ID:", slotId, "type:", typeof slotId);
    console.log("Field ID:", fieldId, "type:", typeof fieldId);

    if (isNaN(slotId) || slotId <= 0) {
      console.error("❌ INVALID SLOT ID:", slotId);
      alert(`Error: ID slot tidak valid. Silakan refresh halaman.`);
      return;
    }

    const bookingData = {
      venueId: venue.id,
      venueName: venue.name,
      fieldId: fieldId,
      fieldName: selectedField.name,
      date: selectedDate,
      timeSlotId: slotId,
      startTime: selectedSlot.start_time,
      endTime: selectedSlot.end_time,
      price: selectedSlot.price,
      savedAt: Date.now(),
    };

    console.log("=== BOOKING DATA TO SAVE ===");
    console.log(JSON.stringify(bookingData, null, 2));

    sessionStorage.removeItem("bookingData");
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));

    const saved = sessionStorage.getItem("bookingData");
    const parsed = saved ? JSON.parse(saved) : null;

    console.log("✅ Verified saved data:", parsed);

    if (!parsed || parsed.timeSlotId !== slotId) {
      console.error("❌ Data verification FAILED!");
      alert("Gagal menyimpan data. Silakan coba lagi.");
      return;
    }

    console.log("✅ All validation passed! Navigating to form...");
    router.push("/booking/form");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="h-12 w-12 mx-auto mb-4"/>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">
          {error || "Venue tidak ditemukan"}
        </div>
        <button
          onClick={() => router.push("/venues")}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Kembali ke Daftar Lapangan
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          {venue.image_url && (
            <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <Image
                src={venue.image_url}
                alt={venue.name}
                fill
                className="object-cover pt-8"
                priority
              />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {venue.name}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{venue.address}</span>
              </div>
              <p className="mt-3 text-gray-700">{venue.description}</p>

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
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "schedule"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              JADWAL
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "gallery"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              GALERI
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-2 border-b-2 font-medium ${
                activeTab === "about"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
            {activeTab === "schedule" && (
              <div>
                {/* Date Selector */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <div className="grid grid-cols-7 gap-2">
                    {dates.map((date) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const isSelected = dateStr === selectedDate;
                      const dayName = format(date, "EEE", { locale: localeId });
                      const dayNumber = format(date, "d");
                      const month = format(date, "MMM", { locale: localeId });

                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`p-3 rounded-lg text-center transition ${
                            isSelected
                              ? "bg-orange-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
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
                              ? "bg-orange-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
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
                      Tidak ada slot untuk tanggal ini
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotClick(slot)}
                            disabled={!slot.is_available}
                            className={`p-4 rounded-lg border-2 transition ${
                              !slot.is_available
                                ? "border-gray-300 bg-gray-100 cursor-not-allowed opacity-60"
                                : selectedSlot?.id === slot.id
                                ? "border-orange-600 bg-orange-50 cursor-pointer"
                                : "border-gray-200 hover:border-orange-300 cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="font-semibold">
                                {formatTime(slot.start_time)} -{" "}
                                {formatTime(slot.end_time)}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatPrice(slot.price)}
                            </div>

                            {slot.is_available ? (
                              <div className="flex items-center justify-center mt-2 text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs font-medium">
                                  Tersedia
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center mt-2 text-red-600">
                                <XCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs font-medium">
                                  Terbooking
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="pt-4 border-t flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-100 border-2 border-green-600 rounded"></div>
                          <span className="text-gray-600">Tersedia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                          <span className="text-gray-600">Terbooking</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "gallery" && (
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

            {activeTab === "about" && (
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
                  <p className="text-gray-500">
                    Tidak ada informasi fasilitas
                  </p>
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
                        {format(new Date(selectedDate), "dd MMM yyyy", {
                          locale: localeId,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Waktu:</span>
                      <span className="font-medium">
                        {formatTime(selectedSlot.start_time)} -{" "}
                        {formatTime(selectedSlot.end_time)}
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