'use client';

import React, { useState } from 'react'; // Hapus useEffect jika tidak dipakai
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { createVenue } from '@/lib/api'; 

export default function CreateVenuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    phone: '', // <-- Tambahkan state phone
    email: '', // <-- Tambahkan state email
    image_url: '',
    facebook_url: '',
    instagram_url: '',
  });
  const [loading, setLoading] = useState(false);

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
      // Kirim semua data form ke API
      const result = await createVenue(formData); 

      if (result.success) {
        toast.success('Venue baru berhasil dibuat!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/venues');
      } else {
        // Tampilkan error validasi atau error server
         const description = result.errors 
            ? Object.values(result.errors).flat().join(', ') // Gabungkan semua pesan error validasi
            : result.message || 'Silakan cek kembali data Anda.';
        toast.error('Gagal membuat venue', { description });
      }
    } catch (error: any) {
      toast.error('Terjadi Kesalahan', {
        description: error.message || 'Tidak dapat terhubung ke server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 md:px-8 mt-15"> 
        {/* Header Halaman */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/venues')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Venue</h1>
            <p className="text-gray-600 text-sm">Isi detail untuk venue baru Anda.</p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Baris 1: Nama */}
              <div>
                <Label htmlFor="name">Nama Venue <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: GOR Senayan Futsal" required />
              </div>

              {/* Baris 2: Deskripsi */}
              <div>
                <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
                <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="Deskripsi singkat tentang venue..." required />
              </div>

              {/* Baris 3: Alamat */}
              <div>
                <Label htmlFor="address">Alamat Lengkap <span className="text-red-500">*</span></Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Asia Afrika No. 8" required />
              </div>

              {/* Baris 4: Kota & Provinsi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="city">Kota <span className="text-red-500">*</span></Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Jakarta Pusat" required />
                </div>
                <div>
                  <Label htmlFor="province">Provinsi <span className="text-red-500">*</span></Label>
                  <Input id="province" name="province" value={formData.province} onChange={handleChange} placeholder="DKI Jakarta" required />
                </div>
              </div>
              
              {/* Baris 5: Telepon & Email Venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Telepon Venue (Opsional)</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" />
                </div>
                <div>
                  <Label htmlFor="email">Email Venue (Opsional)</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="info@venue.com" />
                </div>
              </div>

              {/* Baris 6: Image URL */}
              <div>
                <Label htmlFor="image_url">URL Gambar Utama <span className="text-red-500">*</span></Label>
                <Input id="image_url" name="image_url" type="url" value={formData.image_url} onChange={handleChange} placeholder="https://..." required />
                <p className="text-xs text-gray-500 mt-1">Gunakan link gambar publik (misal dari Unsplash, Imgur).</p>
              </div>

              {/* Baris 7: Social Media (Opsional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="instagram_url">Instagram URL (Opsional)</Label>
                  <Input id="instagram_url" name="instagram_url" type="url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <Label htmlFor="facebook_url">Facebook URL (Opsional)</Label>
                  <Input id="facebook_url" name="facebook_url" type="url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/..." />
                </div>
              </div>
            </div>

            {/* Footer Form */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t"> {/* Tambah border */}
              <Button type="button" variant="outline" onClick={() => router.push('/admin/venues')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Save Venue'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}