'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi frontend sebelum request
    if (formData.password !== formData.confirmPassword) {
      toast.error('Registrasi Gagal', {
        description: 'Konfirmasi password tidak cocok',
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
        },
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();

        let errorMessage = 'Registrasi gagal';

        if (errData.errors) {
          // Ambil semua pesan error dari Laravel
          const allErrors = Object.values(errData.errors)
            .flat()
            .join('\n');
          errorMessage = allErrors;
        } else if (errData.message) {
          errorMessage = errData.message;
        }

        throw new Error(errorMessage);
      }

      // Toast sukses
      toast.success('Registrasi Berhasil!', {
        description: `Akun ${formData.name} berhasil dibuat`,
        duration: 3000,
        icon: <CheckCircle className="h-5 w-5" />,
        style: {
          background: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
        },
      });

      // Redirect ke login setelah delay singkat
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');

      toast.error('Registrasi Gagal', {
        description: err.message || 'Tidak dapat membuat akun',
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
        },
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
          <p className="text-gray-600">Buat akun baru Anda</p>
        </div>

        {/* Register Form */}
        <Card className="bg-white border border-gray-200 shadow-xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm whitespace-pre-line">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Nama Anda"
                />
              </div>

              {/* Email */}
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

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
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
                    <UserPlus size={18} />
                    <span>Daftar</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href="/admin/login" className="text-gray-900 font-semibold hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
