'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Shield, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/hooks/useAuth';
import { isAuthenticated } from '@/lib/api';


export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading, error, clearError } = useAdminAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated('admin')) {
      router.push('/admin/dashboard');
    }
  }, [router]);

// Use Toaster from Sonner for notifications
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const success = await login(formData);
  
  if (success) {
    // Toast success dengan Sonner
    toast.success('Login Berhasil!', {
      description: 'Selamat datang di dashboard admin Kashmir Booking',
      duration: 3000,
      icon: <CheckCircle className="h-5 w-5" />,
      style: {
        background: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        color: '#22c55e',
      },
    });
    
    // Delay redirect sedikit agar toast terlihat
    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 1000);
  } else {
    // Toast error dengan Sonner
    toast.error('Login Gagal', {
      description: 'Email atau password tidak valid',
      duration: 4000,
      icon: <AlertCircle className="h-5 w-5" />,
      style: {
        background: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        color: '#ef4444',
      },
    });
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      <div className="max-w-md w-full relative z-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-black hover:text-black/50 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium text-black">Kembali ke Beranda</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">
              KASHMIR
            </h1>
            <p className="text-lg font-medium text-black tracking-wider">
              BOOKING
            </p>
            <div className="w-16 h-px bg-black mx-auto mt-2"></div>
          </div>
          <p className="text-black ">Masuk ke dashboard admin</p>
        </div>

        {/* Login Form */}
        <Card className="bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Email Admin
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                  placeholder="admin@bookingfield.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-white transition-colors duration-300 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold py-4 rounded-xl text-sm uppercase tracking-wider mt-8"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    <span>Masuk ke Dashboard</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}