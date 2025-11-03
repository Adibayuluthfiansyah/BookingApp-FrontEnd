'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext'; 
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth(); 

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
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/'); 
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setApiErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      toast.error('Registrasi Gagal', { description: 'Konfirmasi password tidak cocok.' });
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 8) {
        setError('Password minimal harus 8 karakter.');
        toast.error('Registrasi Gagal', { description: 'Password minimal 8 karakter.' });
        setLoading(false);
        return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        let errorMessage = 'Registrasi gagal. Silakan coba lagi.';
        if (res.status === 422 && resData.errors) {
          setApiErrors(resData.errors);
          const firstErrorField = Object.keys(resData.errors)[0];
          errorMessage = resData.errors[firstErrorField]?.[0] || errorMessage;
          setError(`Terdapat error pada input: ${firstErrorField}`);
        } else if (resData.message) {
          errorMessage = resData.message;
          setError(errorMessage);
        }
        throw new Error(errorMessage);
      }

      toast.success('Registrasi Berhasil!', {
        description: `Akun untuk ${resData.data?.user?.name || formData.name} berhasil dibuat.`,
        duration: 4000,
        icon: <CheckCircle className="h-5 w-5" />,
      });

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: unknown) {
      if (!error) setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.');
      toast.error('Registrasi Gagal', {
        description: err instanceof Error ? err.message : 'Tidak dapat membuat akun saat ini.',
        duration: 5000,
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
    if (apiErrors[name]) {
      setApiErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getFieldError = (fieldName: keyof typeof formData | 'confirmPassword') => {
      if (fieldName === 'confirmPassword' && formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0) {
        return 'Konfirmasi password tidak cocok.';
      }
      // Tampilkan error dari API
      return apiErrors[fieldName]?.[0];
  };
  
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="h-12 w-12 " />
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
        <div className="absolute inset-0 bg-background/50"></div>
      </div>

      <div className="w-full max-w-md relative z-10 my-12 pt-5">
        <Card className="bg-card border-border shadow-xl rounded-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Buat Akun Baru</CardTitle>
            <CardDescription className="text-muted-foreground">Isi data diri Anda untuk mendaftar.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* General Error  */}
              {error && !Object.keys(apiErrors).length && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Nama */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name" type="text" name="name" required
                  value={formData.name} onChange={handleInputChange} disabled={loading}
                  placeholder="Nama Lengkap Anda"
                  className={getFieldError('name') ? 'border-destructive' : ''}
                  aria-invalid={!!getFieldError('name')}
                  aria-describedby="name-error"
                />
                {getFieldError('name') && <p id="name-error" className="text-xs text-destructive">{getFieldError('name')}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" type="email" name="email" required autoComplete="email"
                  value={formData.email} onChange={handleInputChange} disabled={loading}
                  placeholder="email@example.com"
                  className={getFieldError('email') ? 'border-destructive' : ''}
                  aria-invalid={!!getFieldError('email')}
                  aria-describedby="email-error"
              />
                {getFieldError('email') && <p id="email-error" className="text-xs text-destructive">{getFieldError('email')}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone" type="tel" name="phone" required autoComplete="tel"
                  value={formData.phone} onChange={handleInputChange} disabled={loading}
                  placeholder="08xxxxxxxxxx"
                  className={getFieldError('phone') ? 'border-destructive' : ''}
                  aria-invalid={!!getFieldError('phone')}
                  aria-describedby="phone-error"
              />
                {getFieldError('phone') && <p id="phone-error" className="text-xs text-destructive">{getFieldError('phone')}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? 'text' : 'password'} name="password" required autoComplete="new-password"
                    value={formData.password} onChange={handleInputChange} disabled={loading}
                    placeholder="Minimal 8 karakter"
                    className={`pr-10 ${getFieldError('password') ? 'border-destructive' : ''}`}
                    aria-invalid={!!getFieldError('password')}
                    aria-describedby="password-error"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {getFieldError('password') && <p id="password-error" className="text-xs text-destructive">{getFieldError('password')}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword" type={showPassword ? 'text' : 'password'} name="confirmPassword" required autoComplete="new-password"
                  value={formData.confirmPassword} onChange={handleInputChange} disabled={loading}
                  placeholder="Ulangi password"
                  className={getFieldError('confirmPassword') ? 'border-destructive' : ''}
                  aria-invalid={!!getFieldError('confirmPassword')}
                  aria-describedby="confirm-password-error"
                />
                {getFieldError('confirmPassword') && <p id="confirm-password-error" className="text-xs text-destructive">{getFieldError('confirmPassword')}</p>}
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary/80 cursor-pointer text-primary-foreground font-semibold" size="lg">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <div className="flex items-center gap-2"><UserPlus size={18} /><span>Daftar</span></div>}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground p-6 border-t border-border">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium ml-1 unstyled">
              Masuk di sini
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}