'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, checkAuth } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated && user) {
      // --- PERBAIKAN: Tambahkan cek 'super_admin' ---
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'customer') {
        router.push('/');
      }
      // --- AKHIR PERBAIKAN ---
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        // Tunggu sebentar agar context terupdate
        await new Promise(resolve => setTimeout(resolve, 100));
        checkAuth(); // Force check auth
        
        // Get user from localStorage for immediate access
        const userStr = localStorage.getItem('user');
        const loggedUser = userStr ? JSON.parse(userStr) : null;
        
        // Toast success
        toast.success('Login Berhasil!', {
          description: `Selamat datang, ${loggedUser?.name}`,
          duration: 3000,
          icon: <CheckCircle className="h-5 w-5" />,
          style: {
            background: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
            color: '#22c55e',
          },
        });

        // Redirect berdasarkan role
        setTimeout(() => {
          // --- PERBAIKAN: Tambahkan cek 'super_admin' ---
          if (loggedUser?.role === 'admin' || loggedUser?.role === 'super_admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/'); // Beranda untuk customer
          }
          // --- AKHIR PERBAIKAN ---
        }, 1000);
      } else {
        // Toast error
        setError('Email atau password tidak valid');
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
    } catch (err) {
      const errorMessage = 'Tidak dapat terhubung ke server';
      setError(errorMessage);
      toast.error('Terjadi Kesalahan', {
        description: errorMessage,
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full relative z-10 pt-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Kembali ke Beranda</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              KASHMIR
            </h1>
            <p className="text-lg font-medium text-gray-700 tracking-wider">
              BOOKING
            </p>
            <div className="w-16 h-px bg-gray-900 mx-auto mt-2"></div>
          </div>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white border border-gray-200 shadow-xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
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
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-900 transition-colors duration-300 disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold py-3 rounded-lg text-sm uppercase tracking-wider mt-8"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn size={18} />
                    <span>Masuk</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Belum punya akun?{' '}
                <Link href="/register" className="text-gray-900 font-semibold hover:underline">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}