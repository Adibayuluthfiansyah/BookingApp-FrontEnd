'use client';

import { useState, useEffect, useMemo, useCallback } from 'react'; 
import { getCustomerBookings } from '@/lib/api';
import { Booking } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, XCircle, Search, Calendar, MapPin } from 'lucide-react'; 
import { id as indonesianLocale } from 'date-fns/locale';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';

// Helper format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'eeee, dd MMMM yyyy', {
      locale: indonesianLocale,
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return dateString;
  }
};

// Helper format jam
const formatTime = (time: string | undefined) => {
  if (!time) return '-';
  return time.substring(0, 5); // Ambil HH:MM
};

// Helper untuk badge status
const getStatusBadge = (status: string) => {
  const statuses: Record<
    string,
    { variant: "default" | "destructive" | "outline" | "secondary"; label: string; icon: React.ElementType }
  > = {
    pending: { variant: 'secondary', label: 'Pending', icon: Clock },
    confirmed: { variant: 'default', label: 'Confirmed', icon: CheckCircle },
    paid: { variant: 'default', label: 'Paid', icon: CheckCircle },
    cancelled: { variant: 'destructive', label: 'Cancelled', icon: XCircle },
    completed: { variant: 'outline', label: 'Completed', icon: CheckCircle },
  };

  const badge = statuses[status] || statuses.pending;
  const Icon = badge.icon;

  return (
    <Badge variant={badge.variant} className="inline-flex items-center gap-1.5 shadow-sm">
      <Icon className="w-3.5 h-3.5" />
      {badge.label}
    </Badge>
  );
};

// Komponen Skeleton untuk Card Booking
function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <CardContent className="p-5 md:p-6">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex-1 flex items-start gap-3">
            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-7 w-24 rounded-full flex-shrink-0" />
        </div>
        <div className="border-t border-border pt-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-5 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-border">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-36" />
      </CardFooter>
    </Card>
  );
}

// === Tipe untuk Filter ===
type FilterStatus = 'all' | 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';

const filterTabs: Array<{ value: FilterStatus; label: string; icon: React.ElementType | null }> = [
  { value: 'all', label: 'Semua', icon: null },
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { value: 'paid', label: 'Paid', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  //  Gunakan useCallback untuk loadBookings
  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCustomerBookings();
      if (result.success && Array.isArray(result.data)) {
        //  Urutkan booking terbaru di atas
        const sortedBookings = result.data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setBookings(sortedBookings);
      } else if (!result.success) {
        setError(result.message || 'Gagal mengambil data booking.');
      } else {
        setError('Format data booking tidak valid.');
        setBookings([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadBookings();
  }, [loadBookings]); // Panggil loadBookings saat komponen mount

  // Gunakan useMemo untuk performa filter
  const filteredBookings = useMemo(() => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter(b => b.status === filterStatus);
  }, [bookings, filterStatus]);

  const bookingCounts = useMemo(() => {
    return filterTabs.reduce((acc, tab) => {
      if (tab.value === 'all') {
        acc[tab.value] = bookings.length;
      } else {
        acc[tab.value] = bookings.filter(b => b.status === tab.value).length;
      }
      return acc;
    }, {} as Record<FilterStatus, number>);
  }, [bookings]);

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full border-destructive/20 bg-destructive/5 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Gagal Memuat Data</h3>
              <p className="text-sm text-muted-foreground mb-6">{error}</p>
              <Button variant="destructive" onClick={loadBookings} className="w-full">
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (filteredBookings.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="max-w-md w-full border-border shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {filterStatus === 'all' ? 'Belum Ada Booking' : 'Tidak Ada Hasil'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {filterStatus === 'all'
                  ? 'Anda belum memiliki riwayat booking. Mulai pesan lapangan sekarang!'
                  : `Tidak ada booking dengan status "${filterStatus}"`}
              </p>
              {filterStatus === 'all' ? (
                <Button asChild className="w-full">
                  <Link href="/venues">Cari Lapangan Sekarang</Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setFilterStatus('all')} className="w-full">
                  Lihat Semua Booking
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {filteredBookings.map((booking) => {
          // Ambil image_url dari data
          const imageUrl = booking.field?.venue?.image_url;

          return (
            <Card key={booking.id} className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:border-primary/30">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      
                      {/* PERBAIKAN: Tampilkan Gambar di Sini */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center relative overflow-hidden border">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={booking.field?.venue?.name || 'Venue'}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-foreground line-clamp-1">
                          {booking.field?.venue?.name || 'Venue Tidak Tersedia'}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {booking.field?.name || 'Lapangan Tidak Tersedia'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2"> 
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">No. Booking</p>
                        <p className="font-semibold text-sm text-foreground mt-1 break-all">{booking.booking_number}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Tanggal Main</p>
                        <p className="font-semibold text-sm text-foreground mt-1">{formatDate(booking.booking_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Jam Main</p>
                        <p className="font-semibold text-sm text-foreground mt-1">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-5 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-border">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(booking.total_amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Dipesan: {format(new Date(booking.created_at), 'dd/MM/yy HH:mm')}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <CustomerLayout>
      <div className="space-y-6 pb-8">
        {/* Header Section */}
        <div className="pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                Booking Saya
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Kelola dan pantau semua riwayat booking Anda
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-medium px-3 py-1.5 border-border">
                Total: {bookings.length} Booking
              </Badge>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {!loading && bookings.length > 0 && (
          <Card className="border-border shadow-sm">
            <CardContent className="p-3 md:p-4">
              {/* PERBAIKAN: Buat filter bisa di-scroll di HP */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {filterTabs.map((filter) => {
                  const count = bookingCounts[filter.value];
                  // Jangan tampilkan filter jika count 0 (kecuali 'all')
                  if (count === 0 && filter.value !== 'all') return null;

                  return (
                    <Button
                      key={filter.value}
                      variant={filterStatus === filter.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(filter.value)}
                      className="flex items-center gap-1.5 flex-shrink-0"
                    >
                      {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
                      {filter.label}
                      <Badge
                        variant={filterStatus === filter.value ? 'secondary' : 'outline'}
                        className="ml-1 text-xs px-1.5 py-0"
                      >
                        {count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {renderContent()}
      </div>
    </CustomerLayout>
  );
}