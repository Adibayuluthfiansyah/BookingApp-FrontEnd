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
import { getTimeSlotById, updateTimeSlot, getMyFieldsList } from '@/lib/api'; 
import { SimpleField, TimeSlot } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 

export default function EditTimeSlotPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; 

  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [fields, setFields] = useState<SimpleField[]>([]);
  const [formData, setFormData] = useState({
    field_id: '',
    start_time: '',
    end_time: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errorLoad, setErrorLoad] = useState<string | null>(null); 

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setErrorLoad("ID Time Slot tidak valid.");
      setLoadingData(false);
      return;
    }

    const loadData = async () => {
      setLoadingData(true);
      setErrorLoad(null); 
      try {
        const [slotResult, fieldsResult] = await Promise.all([
          getTimeSlotById(Number(id)),
          getMyFieldsList()
        ]);
        
        if (fieldsResult.success && fieldsResult.data) {
          setFields(fieldsResult.data);
        } else {
          toast.error('Gagal memuat daftar lapangan', { description: fieldsResult.message });
        }

        if (slotResult.success && slotResult.data) {
          const slotData = slotResult.data;
          setSlot(slotData);
          setFormData({
            field_id: String(slotData.field_id),
            start_time: slotData.start_time.substring(0, 5), // "08:00:00" -> "08:00"
            end_time: slotData.end_time.substring(0, 5), // "09:00:00" -> "09:00"
            price: String(slotData.price),
          });
        } else {
          setErrorLoad(slotResult.message || 'Gagal memuat data slot.');
          toast.error('Gagal memuat data slot', { description: slotResult.message });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data.';
        setErrorLoad(message);
        toast.error('Error', { description: message });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [id]);

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
      start_time: formData.start_time + ':00', 
      end_time: formData.end_time + ':00',
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
      const result = await updateTimeSlot(Number(id), dataToSubmit as unknown as {field_id: number; start_time: string; end_time: string; price: number;}); 

      if (result.success) {
        toast.success('Time slot berhasil diupdate!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/timeslots');
      } else {
        const description = result.errors 
            ? Object.values(result.errors).flat().join(', ') 
            : result.message || 'Silakan cek kembali data Anda.';
        toast.error('Gagal mengupdate slot', { description });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupdate slot.';
      toast.error('Terjadi Kesalahan', {
        description: message,
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
              <p className="font-semibold text-red-700 mb-2">Gagal Memuat Time Slot</p>
              <p className="text-sm text-red-600 mb-6">{errorLoad}</p>
              <Button onClick={() => router.push('/admin/timeslots')}>
                  Kembali ke Daftar
              </Button>
            </Card>
        </div>
      </AdminLayout>
    );
  }

  if (!slot) {
      return <AdminLayout><div>Slot tidak ditemukan.</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/timeslots')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Time Slot</h1>
            <p className="text-gray-600 text-sm">Perbarui jam buka dan harga.</p>
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
                  disabled={fields.length === 0}
                >
                  <SelectTrigger id="field_id">
                    <SelectValue placeholder={"Pilih Lapangan..."} />
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
                </div>
                <div>
                  <Label htmlFor="end_time">Jam Selesai <span className="text-red-500">*</span></Label>
                  <Input id="end_time" name="end_time" type="time" value={formData.end_time} onChange={handleChange} required />
                </div>
              </div>
              
              {/* Harga */}
              <div>
                <Label htmlFor="price">Harga (IDR) <span className="text-red-500">*</span></Label>
                <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} placeholder="150000" required />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/timeslots')}>
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