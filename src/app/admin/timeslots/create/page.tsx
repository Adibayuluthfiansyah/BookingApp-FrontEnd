'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { createTimeSlot, getMyFieldsList } from '@/lib/api'; 
import { SimpleField } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 

export default function CreateTimeSlotPage() {
  const router = useRouter();
  const [fields, setFields] = useState<SimpleField[]>([]);
  const [formData, setFormData] = useState({
    field_id: '',
    start_time: '',
    end_time: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    // Load daftar fields untuk dropdown
    const loadFields = async () => {
      setLoadingFields(true);
      const result = await getMyFieldsList();
      if (result.success && result.data) {
        setFields(result.data);
      } else {
        toast.error('Gagal memuat daftar lapangan', {
          description: result.message,
        });
      }
      setLoadingFields(false);
    };
    loadFields();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, field_id: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      field_id: parseInt(formData.field_id, 10),
      price: parseFloat(formData.price),
      start_time: formData.start_time + ':00', // Tambah detik "HH:mm:ss"
      end_time: formData.end_time + ':00', // Tambah detik "HH:mm:ss"
    };
    
    // Validasi sederhana
    if (!dataToSubmit.field_id || !dataToSubmit.start_time || !dataToSubmit.end_time || isNaN(dataToSubmit.price)) {
        toast.error('Harap isi semua field dengan benar.');
        setLoading(false);
        return;
    }
    
    if (dataToSubmit.start_time >= dataToSubmit.end_time) {
         toast.error('Jam selesai harus setelah jam mulai.');
         setLoading(false);
         return;
    }

    try {
      const result = await createTimeSlot(dataToSubmit as any); 

      if (result.success) {
        toast.success('Time slot berhasil dibuat!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/timeslots');
      } else {
         const description = result.errors 
            ? Object.values(result.errors).flat().join(', ') 
            : result.message || 'Silakan cek kembali data Anda.';
        toast.error('Gagal membuat time slot', { description });
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
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        {/* Header Halaman */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/timeslots')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Time Slot</h1>
            <p className="text-gray-600 text-sm">Buat jam buka dan harga baru untuk lapangan.</p>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Lapangan */}
              <div>
                <Label htmlFor="field_id">Lapangan <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.field_id}
                  onValueChange={handleSelectChange}
                  disabled={loadingFields}
                >
                  <SelectTrigger id="field_id">
                    <SelectValue placeholder={loadingFields ? "Memuat..." : "Pilih Lapangan..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field.id} value={String(field.id)}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="start_time">Jam Mulai <span className="text-red-500">*</span></Label>
                  <Input id="start_time" name="start_time" type="time" value={formData.start_time} onChange={handleChange} required />
                  <p className="text-xs text-gray-500 mt-1">Contoh: 08:00</p>
                </div>
                <div>
                  <Label htmlFor="end_time">Jam Selesai <span className="text-red-500">*</span></Label>
                  <Input id="end_time" name="end_time" type="time" value={formData.end_time} onChange={handleChange} required />
                   <p className="text-xs text-gray-500 mt-1">Contoh: 09:00</p>
                </div>
              </div>
              
              {/* Harga */}
              <div>
                <Label htmlFor="price">Harga (IDR) <span className="text-red-500">*</span></Label>
                <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} placeholder="150000" required />
              </div>
            </div>

            {/* Footer Form */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/timeslots')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingFields}>
                {loading ? 'Menyimpan...' : 'Save Time Slot'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}