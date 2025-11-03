"use client";

import { useState, useEffect, useCallback } from "react"; 
import { useRouter } from "next/navigation";
import {DollarSign,Calendar,TrendingUp,Clock,AlertCircle,Loader2,} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Booking } from "@/types"; 

interface DashboardStats {
  today: { bookings: number; revenue: number };
  monthly: { bookings: number; revenue: number };
  overall: {
    total_bookings: number;
    total_revenue: number;
    pending_bookings: number;
  };
  recent_bookings: Booking[]; 
  bookings_by_status: Record<string, number>;
  revenue_by_venue: Array<{
    venue_id?: string;
    venue_name: string;
    revenue: number;
  }>;
  user_role?: string;
  managed_venues_count?: number | string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time: string | undefined) => {
  if (!time) return "-";
  return time.substring(0, 5);
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await getAdminDashboardStats(userTimezone);
      if (result.success && result.data) {
        setStats((result.data as unknown as DashboardStats) || null);
      } else {
        setError(result.message || "Gagal mengambil data dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]); 

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-500 text-white text-xs sm:text-sm"
          >
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-600 text-white text-xs sm:text-sm"
          >
            Confirmed
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="secondary"
            className="bg-green-600 text-white text-xs sm:text-sm"
          >
            Paid
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="text-xs sm:text-sm">
            Cancelled
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-green-700 text-white text-xs sm:text-sm"
          >
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs sm:text-sm">
            {status}
          </Badge>
        );
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] px-4">
          <div className="text-center">
            <Loader2 className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-4" />
            <p className="text-sm sm:text-base text-muted-foreground">
              Memuat dashboard...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] px-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-destructive text-lg sm:text-xl">
                Gagal Memuat Dashboard
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={loadDashboardStats} className="text-sm sm:text-base">
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] px-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-lg sm:text-xl">
                Data Tidak Ditemukan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={loadDashboardStats} className="text-sm sm:text-base">
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const totalBookingsByStatus = Object.values(
      stats.bookings_by_status,
    ).reduce((a, b) => a + b, 0);

    return (
      <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-0">
        {/* Info Admin */}
        {stats.user_role && (
          <div
            className={`border-l-4 p-3 sm:p-4 rounded-md ${
              stats.user_role === "super_admin"
                ? "bg-destructive/10 border-destructive text-destructive"
                : "bg-blue-100 border-blue-500 text-blue-700"
            }`}
          >
            <p className="font-bold text-sm sm:text-base">
              {stats.user_role === "super_admin"
                ? "Mode Super Admin"
                : "Mode Admin"}
            </p>
            <p className="text-xs sm:text-sm mt-1">
              {stats.user_role === "super_admin"
                ? `Anda melihat statistik gabungan dari ${stats.managed_venues_count} venue.`
                : `Anda melihat statistik untuk ${stats.managed_venues_count} venue yang Anda kelola.`}
            </p>
          </div>
        )}

        {/* Stats Grid - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Pendapatan Hari Ini
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold break-words">
                {formatCurrency(stats.today.revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.today.bookings} booking hari ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Pendapatan Bulan Ini
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold break-words">
                {formatCurrency(stats.monthly.revenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.monthly.bookings} booking bulan ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Booking
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.overall.total_bookings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Semua waktu</p>
            </CardContent>
          </Card>
          <Card
            className="hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => router.push("/admin/bookings?status=pending")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Booking Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold">
                {stats.overall.pending_bookings}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Klik untuk melihat detail
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Booking by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              {Object.keys(stats.bookings_by_status).length > 0 ? (
                Object.entries(stats.bookings_by_status).map(
                  ([status, count]) => {
                    const percentage =
                      totalBookingsByStatus > 0
                        ? (count / totalBookingsByStatus) * 100
                        : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-xs sm:text-sm font-medium capitalize truncate">
                            {status}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  },
                )
              ) : (
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Belum ada data status booking.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">
                Top 5 Venue by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {stats.revenue_by_venue && stats.revenue_by_venue.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.revenue_by_venue.map((venue, index) => (
                    <div
                      key={venue.venue_id || index}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                            #{index + 1}
                          </span>
                        </div>
                        <span
                          className="text-xs sm:text-sm font-medium truncate"
                          title={venue.venue_name}
                        >
                          {venue.venue_name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-green-600 flex-shrink-0 ml-2">
                        {formatCurrency(venue.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Belum ada data revenue per venue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings Table - Responsive Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Recent Bookings
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Daftar 5 booking terbaru.
              </CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="text-xs sm:text-sm w-full sm:w-auto"
            >
              <Link href="/admin/bookings">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Booking #
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">
                      Venue & Field
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Tanggal
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Total
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recent_bookings && stats.recent_bookings.length > 0 ? (
                    stats.recent_bookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        onClick={() =>
                          router.push(`/admin/bookings/${booking.id}`)
                        }
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium text-xs sm:text-sm">
                          {booking.booking_number || "-"}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="font-medium">
                            {booking.customer_name || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.customer_phone || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                          <div className="font-medium">
                            {booking.field?.venue?.name || "-"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {booking.field?.name || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          <div className="whitespace-nowrap">
                            {formatDate(booking.booking_date)}
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTime(booking.start_time)} -{" "}
                            {formatTime(booking.end_time)}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                          {booking.total_amount
                            ? formatCurrency(booking.total_amount)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status || "pending")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-24 text-center text-muted-foreground text-xs sm:text-sm"
                      >
                        Belum ada booking terbaru.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return <AdminLayout>{renderContent()}</AdminLayout>;
}