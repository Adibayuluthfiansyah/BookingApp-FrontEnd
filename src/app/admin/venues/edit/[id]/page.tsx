'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'; 
import { getVenueById, updateVenue } from '@/lib/api'; 
import { Venue } from '@/types';

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; 

  const [venue, setVenue] = useState<Venue | null>(null);
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
      // Optional: redirect ke halaman venues
      // router.push('/admin/venues'); 
      return;
    }

    const loadVenueData = async () => {
      setLoadingData(true);
      setErrorLoad(null); 
      try {
        const result = await getVenueById(Number(id)); 
        if (result.success && result.data) {
          const venueData = result.data;
          setVenue(venueData);
          setFormData({
            name: venueData.name || '',
            description: venueData.description || '',
            address: venueData.address || '',
            city: venueData.city || '',
            province: venueData.province || '',
            phone: venueData.phone || '', // <-- Isi state phone
            email: venueData.email || '', // <-- Isi state email
            image_url: venueData.image_url || '',
            facebook_url: venueData.facebook_url || '',
            instagram_url: venueData.instagram_url || '',
          });
        } else {
          setErrorLoad(result.message || 'Gagal memuat data venue.');
          toast.error('Gagal memuat data venue', { description: result.message });
          // Optional: redirect jika gagal load
          // router.push('/admin/venues'); 
        }
      } catch (error: any) {
        setErrorLoad(error.message || 'Terjadi kesalahan saat memuat data.');
        toast.error('Error', { description: error.message });
      } finally {
        setLoadingData(false);
      }
    };

    loadVenueData();
  }, [id, router]); // Dependency array

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


  if (loadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }


  if (errorLoad) {
     return (
       <AdminLayout>
         <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 md:px-8 text-center">
            <Card className="inline-block p-8 border-red-200 bg-red-50">
               <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <p className="font-semibold text-red-700 mb-2">Gagal Memuat Venue</p>
               <p className="text-sm text-red-600 mb-6">{errorLoad}</p>
               <Button onClick={() => router.push('/admin/venues')}>
                  Kembali ke Daftar Venue
               </Button>
            </Card>
         </div>
       </AdminLayout>
     );
  }


  if (!venue) {
      return <AdminLayout><div>Venue tidak ditemukan.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/venues')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Venue: {venue.name}</h1>
            <p className="text-gray-600 text-sm">Perbarui detail untuk venue ini.</p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Nama */}
              <div>
                <Label htmlFor="name">Nama Venue <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              {/* Deskripsi */}
              <div>
                <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
                <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" required />
              </div>
              {/* Alamat */}
              <div>
                <Label htmlFor="address">Alamat Lengkap <span className="text-red-500">*</span></Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              {/* Kota & Provinsi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div> <Label htmlFor="city">Kota <span className="text-red-500">*</span></Label> <Input id="city" name="city" value={formData.city} onChange={handleChange} required /> </div>
                <div> <Label htmlFor="province">Provinsi <span className="text-red-500">*</span></Label> <Input id="province" name="province" value={formData.province} onChange={handleChange} required /> </div>
              </div>
              {/* Telepon & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div> <Label htmlFor="phone">Telepon Venue (Opsional)</Label> <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} /> </div>
                <div> <Label htmlFor="email">Email Venue (Opsional)</Label> <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} /> </div>
              </div>
              {/* Image URL */}
              <div>
                <Label htmlFor="image_url">URL Gambar Utama <span className="text-red-500">*</span></Label>
                <Input id="image_url" name="image_url" type="url" value={formData.image_url} onChange={handleChange} required />
              </div>
              {/* Social Media */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div> <Label htmlFor="instagram_url">Instagram URL (Opsional)</Label> <Input id="instagram_url" name="instagram_url" type="url" value={formData.instagram_url} onChange={handleChange} /> </div>
                <div> <Label htmlFor="facebook_url">Facebook URL (Opsional)</Label> <Input id="facebook_url" name="facebook_url" type="url" value={formData.facebook_url} onChange={handleChange} /> </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/venues')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}