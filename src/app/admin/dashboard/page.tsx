'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { getAdminDashboard } from '@/lib/api';
import { toast } from 'sonner';
import {
Users,Calendar,DollarSign,Grid3x3,Plus,Eye,Settings,RefreshCw,AlertCircle,CheckCircle,Info,} from 'lucide-react';
import { DashboardStats } from '@/types';
import StatsCard from '@/components/admin/AdminStatsCard';
import QuickActionCard from '@/components/admin/AdminQuickAction';
import { useAuth } from '@/app/contexts/AuthContext';


export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth()
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

 useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminDashboard();

      if (response.success) {
        setStats(response.data.stats);
        if (!loading) {
          toast.success('Data berhasil dimuat!', {
            icon: <CheckCircle className="h-5 w-5" />,
            duration: 2000,
          });
        }
      } else {
        setError('Gagal memuat data dashboard');
        toast.error('Gagal memuat data dashboard', {
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }
    } catch (err: any) {
      console.error('Dashboard error:', err);
      setError('Terjadi kesalahan saat memuat data');
      toast.error('Terjadi kesalahan saat memuat data', {
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info('Memuat ulang data...', { duration: 1000 });
    await fetchDashboardData();
  };

  // State Loading
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Memuat dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // State Error
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
            <Button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
            Halo {user?.name}, selamat datang di Kashmir Booking Fields Admin
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
          </select>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Revenue Hari Ini"
          value={formatCurrency(stats?.revenue_today || 0)}
          change="18.2%"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          color="#10b981"
        />
        <StatsCard
          title="Total Bookings"
          value={stats?.total_bookings?.toString() || '0'}
          change="23.4%"
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          color="#3b82f6"
        />
        <StatsCard
          title="Total Customers"
          value={stats?.total_customers?.toString() || '0'}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="#8b5cf6"
        />
        <StatsCard
          title="Total Fields"
          value={stats?.total_fields?.toString() || '0'}
          icon={<Grid3x3 className="w-6 h-6 text-orange-600" />}
          color="#f59e0b"
        />
      </div>

      {/* Info Card */}
      <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div className="ml-3">
            <h3 className="text-base font-semibold text-blue-900">Dashboard Connected to API</h3>
            <p className="mt-2 text-sm text-blue-800 leading-relaxed">
              Dashboard data is real-time from Laravel backend. Authentication and authorization
              systems are working properly.
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <QuickActionCard
            title="Add Venue"
            href="/admin/venues"
            icon={<Plus className="w-6 h-6 text-blue-600" />}
            color="#3b82f6"
          />
          <QuickActionCard
            title="View Bookings"
            href="/admin/bookings"
            icon={<Eye className="w-6 h-6 text-green-600" />}
            color="#10b981"
          />
          <QuickActionCard
            title="Manage Fields"
            href="/admin/fields"
            icon={<Grid3x3 className="w-6 h-6 text-purple-600" />}
            color="#8b5cf6"
          />
          <QuickActionCard
            title="Settings"
            href="/admin/settings"
            icon={<Settings className="w-6 h-6 text-orange-600" />}
            color="#f59e0b"
          />
        </div>
      </div>
    </AdminLayout>
  );
}
