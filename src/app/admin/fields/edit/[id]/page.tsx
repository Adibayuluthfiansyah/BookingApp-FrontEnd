'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAdminFieldDetail, updateAdminField } from '@/lib/api';
import { Field } from '@/types';

export default function EditFieldPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [field, setField] = useState<Field | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    field_type: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadFieldData = async () => {
      setLoadingData(true);
      try {
        const result = await getAdminFieldDetail(parseInt(id));
        if (result.success && result.data) {
          setField(result.data);
          setFormData({
            name: result.data.name,
            field_type: result.data.field_type,
            description: result.data.description || '',
          });
        } else {
          toast.error(result.message || 'Gagal memuat data lapangan.');
          router.push('/admin/fields');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan.';
        toast.error(message);
      } finally {
        setLoadingData(false);
      }
    };

    loadFieldData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateAdminField(parseInt(id), {
        name: formData.name,
        field_type: formData.field_type,
        description: formData.description,
      });

      if (result.success) {
        toast.success('Lapangan berhasil diupdate.');
        router.push('/admin/fields');
      } else {
        toast.error(result.message || 'Gagal mengupdate lapangan.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData || !field) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Edit Field: {field.name}
          </h1>
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={field.venue?.name || 'Loading...'}
                    disabled // Venue tidak boleh diubah dari halaman ini
                  />
                </div>

                <div>
                  <Label htmlFor="name">Field Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="field_type">Field Type</Label>
                  <select
                    id="field_type"
                    name="field_type"
                    value={formData.field_type}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="futsal">Futsal</option>
                    <option value="minisoccer">Mini Soccer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push('/admin/fields')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}