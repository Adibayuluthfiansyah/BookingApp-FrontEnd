'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { Skeleton } from '@/components/ui/skeleton'; 
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { getVenueById, updateVenue } from '@/lib/api';
import { Venue } from '@/types';

// Komponen Skeleton untuk Form Loading
function EditVenueSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Form Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
              </div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Kolom Aksi Skeleton */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardFooter className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [venueName, setVenueName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    email: '',
    image_url: '',
    facebook_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true); 
  const [errorLoad, setErrorLoad] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setErrorLoad("ID Venue tidak valid."); 
      setLoadingData(false);
      return;
    }

    const loadVenueData = async () => {
      setLoadingData(true);
      setErrorLoad(null);
      try {
        const result = await getVenueById(Number(id));
        if (result.success && result.data) {
          const venueData = result.data;
          setVenueName(venueData.name || 'Venue'); 
          setFormData({
            name: venueData.name || '',
            description: venueData.description || '',
            address: venueData.address || '',
            city: venueData.city || '',
            province: venueData.province || '',
            phone: venueData.phone || '',
            email: venueData.email || '',
            image_url: venueData.image_url || '',
            facebook_url: venueData.facebook_url || '',
            instagram_url: venueData.instagram_url || '',
          });
        } else {
          setErrorLoad(result.message || 'Gagal memuat data venue.');
          toast.error('Gagal memuat data venue', { description: result.message });
        }
      } catch (error: any) {
        setErrorLoad(error.message || 'Terjadi kesalahan saat memuat data.');
        toast.error('Error', { description: error.message });
      } finally {
        setLoadingData(false);
      }
    };

    loadVenueData();
  }, [id, router]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateVenue(Number(id), formData);

      if (result.success) {
        toast.success('Venue berhasil diupdate!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/venues');
      } else {
        const description = result.errors
          ? Object.values(result.errors).flat().join(', ')
          : result.message || 'Silakan cek kembali data Anda.';
        toast.error('Gagal mengupdate venue', { description });
      }
    } catch (error: any) {
      toast.error('Terjadi Kesalahan', {
        description: error.message || 'Tidak dapat terhubung ke server.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Render Skeleton saat loadingData
  if (loadingData) {
    return (
      <AdminLayout>
        {/* Header Halaman (Skeleton) */}
        <div className="flex items-center gap-4 mb-6">
          <Button type="button" variant="outline" size="icon" className="h-9 w-9" disabled>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Edit Venue</h1>
            <Skeleton className="h-4 w-32 mt-1" />
          </div>
        </div>
        <EditVenueSkeleton />
      </AdminLayout>
    );
  }

  // Render Error jika ada errorLoad 
  if (errorLoad) {
    return (
      <AdminLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button type="button" variant="outline" size="icon" onClick={() => router.push('/admin/venues')} className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Error</h1>
        </div>
        <Card className="max-w-lg mx-auto border-destructive/50 bg-destructive/10 text-destructive">
          <CardHeader className="text-center pt-8">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>Gagal Memuat Venue</CardTitle>
            <CardDescription className="text-destructive/80">
              {errorLoad} {/* Menampilkan pesan "ID Venue tidak valid." */}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <Button onClick={() => router.push('/admin/venues')} variant="destructive">
              Kembali ke Daftar Venue
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" onClick={() => router.push('/admin/venues')} className="h-9 w-9 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Kembali</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Edit Venue</h1>
            <p className="text-muted-foreground text-sm truncate max-w-xs sm:max-w-md">
              Memperbarui {venueName}
            </p>
          </div>
        </div>
         {/* Tombol aksi di header untuk mobile  */}
         <div className="flex lg:hidden gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/venues')} className="w-1/2 sm:w-auto">Batal</Button>
            <Button type="submit" form="venue-form" disabled={loading} className="w-1/2 sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
         </div>
      </div>

      <form id="venue-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Kolom Form Kiri (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Informasi Utama</CardTitle>
                <CardDescription>Detail dasar, alamat, dan kontak.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Venue <span className="text-destructive">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi <span className="text-destructive">*</span></Label>
                  <Textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="min-h-[100px]" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap <span className="text-destructive">*</span></Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota <span className="text-destructive">*</span></Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi <span className="text-destructive">*</span></Label>
                    <Input id="province" name="province" value={formData.province} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Kontak & Media</CardTitle>
                <CardDescription>URL untuk gambar utama dan media sosial.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon Venue (Opsional)</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Venue (Opsional)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL Gambar Utama <span className="text-destructive">*</span></Label>
                  <Input id="image_url" name="image_url" type="url" value={formData.image_url} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instagram_url">Instagram URL (Opsional)</Label>
                    <Input id="instagram_url" name="instagram_url" type="url" value={formData.instagram_url} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook_url">Facebook URL (Opsional)</Label>
                    <Input id="facebook_url" name="facebook_url" type="url" value={formData.facebook_url} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Aksi Kanan */}
          <div className="lg:col-span-1 hidden lg:block">
            <Card className="border-border shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle>Aksi</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" form="venue-form" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push('/admin/venues')} className="w-full">
                  Batal
                </Button>
              </CardFooter>
            </Card>
          </div>
          
        </div>
      </form>
    </AdminLayout>
  );
}