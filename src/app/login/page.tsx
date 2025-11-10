'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, loading: authLoading, checkAuth } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/'); 
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        checkAuth(); 
        
        toast.success('Login Berhasil!', {
          description: `Selamat datang kembali!`,
          duration: 3000,
          icon: <CheckCircle className="h-5 w-5" />,
        });
        
      } else {
        // Set error lokal untuk ditampilkan di form
        setError('Email atau password tidak valid. Silakan coba lagi.');
      }
    } catch (err:unknown) {
      const message = err instanceof Error ? err.message : "Gagal keluar";
      setError(message);
      toast.error('Terjadi Kesalahan', {
        description: message,
        duration: 4000,
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };


  if (authLoading || isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
            src="/hero.jpg" 
            alt="Background"
            fill
            priority
            className="object-cover object-center w-full h-full opacity-90 dark:opacity-5"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent"></div> {/* Gradient overlay */}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-4 pt-7">
          <h1 className="text-3xl font-bold text-primary-foreground mb-2 tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className=" text-primary-foreground">Masuk ke akun Anda</p>
        </div>

        {/* Card login */}
        <Card className="bg-card border-border shadow-xl rounded-lg relative">
          <CardContent className="p-6 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

                {/* Logo */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-12 sm:-top-14 md:-top-16 z-10 mt-8 flex items-center">
                <div
                  className="w-[300px] h-[150px] sm:w-[200px] sm:h-[100px] md:w-[400px] md:h-[200px] bg-primary"
                  style={{
                    maskImage: 'url(/logobookingapp1.png)',
                    WebkitMaskImage: 'url(/logobookingapp1.png)',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                />
              </div>

              {/* Email */}
              <div className="space-y-2 mt-12 sm:mt-14 md:mt-16">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="email@example.com"
                  className="h-11" 
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* FITUR MASIH PERLU DIIMPLEMENTASIKAN 
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline unstyled">
                      Lupa Password?
                   </Link> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    className="h-11 pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Tombol submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/80 cursor-pointer text-primary-foreground font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    <span>Masuk</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground p-6 border-t border-border">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium ml-1 unstyled">
              Daftar Sekarang
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}