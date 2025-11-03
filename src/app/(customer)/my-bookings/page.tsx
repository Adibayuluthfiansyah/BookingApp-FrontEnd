'use client';

import { useState, useEffect } from 'react';
import { getCustomerBookings } from '@/lib/api'; 
import { Booking } from '@/types'; 
import { Card,  CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { format } from 'date-fns'; 
import { id as indonesianLocale } from 'date-fns/locale';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout'; 
import { Button } from '@/components/ui/button'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'; 

// Helper format tanggal
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  try {
    return format(new Date(dateString), 'eeee, dd MMMM yyyy', { 
      locale: indonesianLocale 
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

// Helper untuk badge status (Menggunakan Shadcn Badge)
const getStatusBadge = (status: string) => {
  const statuses: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string; icon: React.ElementType }> = {
    pending: { variant: 'secondary', label: 'Pending', icon: Clock },
    confirmed: { variant: 'default', label: 'Confirmed', icon: CheckCircle }, 
    paid: { variant: 'default', label: 'Paid', icon: CheckCircle },
    cancelled: { variant: 'destructive', label: 'Cancelled', icon: XCircle },
    completed: { variant: 'outline', label: 'Completed', icon: CheckCircle },
  };
  
  const badge = statuses[status] || statuses.pending;
  const Icon = badge.icon;
  
  return (
    <Badge variant={badge.variant} className="inline-flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />
      {badge.label}
    </Badge>
  );
};

// Komponen Skeleton untuk Card Booking
function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-5 py-3 flex justify-between items-center">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}


export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCustomerBookings(); 
      if (result.success && Array.isArray(result.data)) {
        setBookings(result.data);
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
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (loading) {
      // Tampilkan 3 Skeleton
      return (
        <div className="space-y-6">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-center py-12">
          <Card className="inline-block p-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="font-semibold text-destructive-foreground">Gagal Memuat Data</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="destructive" onClick={loadBookings}>
              Coba Lagi
            </Button>
          </Card>
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <Card className="text-center p-12 border-border">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Anda belum memiliki riwayat booking.</p>
          <Button asChild>
            <Link href="/venues">
              Cari Lapangan Sekarang
            </Link>
          </Button>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden border-border">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <div>
                  <CardTitle className="text-lg">
                    {booking.field?.venue?.name || 'Venue Tidak Tersedia'}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {booking.field?.name || 'Lapangan Tidak Tersedia'}
                  </CardDescription>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-medium">No. Booking</p>
                    <p className="font-medium text-foreground break-words">{booking.booking_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-medium">Tanggal Main</p>
                    <p className="font-medium text-foreground">{formatDate(booking.booking_date)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-medium">Jam</p>
                    <p className="font-medium text-foreground">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <span className="text-lg font-bold text-primary mb-2 sm:mb-0">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(booking.total_amount)}
              </span>
              <span className="text-xs text-muted-foreground">
                Dipesan pada: {format(new Date(booking.created_at), 'dd/MM/yy HH:mm')}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <CustomerLayout>
      <h1 className="text-2xl font-bold text-foreground mb-6 pt-8">Booking Saya</h1>
      {renderContent()}
    </CustomerLayout>
  );
}
