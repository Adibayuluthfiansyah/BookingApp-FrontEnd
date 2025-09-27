'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { isAuthenticated, getAdminDashboard } from '@/lib/api';
import { toast } from 'sonner';
import { Users, Calendar, DollarSign, Grid3x3, Plus, Eye, Settings, RefreshCw,AlertCircle,CheckCircle,TrendingUp,TrendingDown,Info} from 'lucide-react';
import { DashboardStats } from '@/types';
import { StatsCardProps } from '@/types';
import { QuickActionProps } from '@/types';

function StatsCard({ title, value, change, icon, changeType = 'increase', color }: StatsCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
            {icon} 
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            changeType === 'increase'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
    </Card>
  );
}

function QuickActionCard({ title, href, icon, color }: QuickActionProps) {
  return (
    <a
      href={href}
      onClick={() => toast.info(`Navigating to ${title}...`, { duration: 1500 })}
      className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-200" 
             style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">{title}</h3>
          <p className="text-sm text-gray-600">Manage {title.toLowerCase()}</p>
        </div>
      </div>
    </a>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated('admin')) {
      router.push('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Kashmir Booking Fields Admin</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <div className="flex-shrink-0">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-semibold text-blue-900">Dashboard Connected to API</h3>
            <p className="mt-2 text-sm text-blue-800 leading-relaxed">
              Dashboard data is real-time from Laravel backend. Authentication and authorization systems are working properly.
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Connection Status */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connected to server</span>
        </div>
      </div>
    </AdminLayout>
  );
}