'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'customer') {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        await new Promise(resolve => setTimeout(resolve, 100));
        checkAuth();
        const userStr = localStorage.getItem('user');
        const loggedUser = userStr ? JSON.parse(userStr) : null;

        toast.success('Login Berhasil!', {
          description: `Selamat datang, ${loggedUser?.name}`,
          duration: 3000,
          icon: <CheckCircle className="h-5 w-5" />,
        });

        setTimeout(() => {
          if (loggedUser?.role === 'admin' || loggedUser?.role === 'super_admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/');
          }
        }, 1000);
      } else {
        setError('Email atau password tidak valid');
        toast.error('Login Gagal', {
          description: 'Email atau password tidak valid',
          duration: 4000,
          icon: <AlertCircle className="h-5 w-5" />,
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
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/bg-field.jpg')] bg-cover bg-center relative">
      {/* Overlay gelap transparan */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm"></div>

      <div className="max-w-md w-full relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            O7ONG CORP
          </h1>
          <p className="text-gray-200 text-sm tracking-widest uppercase">Booking System</p>
          <div className="w-16 h-[2px] bg-white/70 mx-auto mt-3"></div>
        </div>

        {/* Card login */}
        <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-400/40 text-red-200 rounded-lg text-sm">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80 tracking-wider uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 disabled:opacity-50"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80 tracking-wider uppercase">
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
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Tombol submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 hover:opacity-90 text-white font-semibold py-3 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-lg shadow-white-500/30 disabled:opacity-50 cursor-pointer"
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

            {/* Info tambahan */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Belum punya akun?{' '}
                <Link href="/register" className="text-white font-semibold hover:underline">
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
