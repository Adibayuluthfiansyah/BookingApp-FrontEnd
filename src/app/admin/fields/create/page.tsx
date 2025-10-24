'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAdminVenues, createAdminField } from '@/lib/api';
import { Venue } from '@/types';

export default function CreateFieldPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    venue_id: '',
    field_type: 'futsal',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(true);

  useEffect(() => {
    const loadVenues = async () => {
      setLoadingVenues(true);
      const result = await getAdminVenues(); 
      if (result.success && result.data) {
        setVenues(result.data);
      } else {
        toast.error('Gagal memuat data venue.');
      }
      setLoadingVenues(false);
    };
    loadVenues();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.venue_id) {
        toast.error('Anda harus memilih venue terlebih dahulu.');
        setLoading(false);
        return;
    }

    try {
      const result = await createAdminField({
        ...formData,
        venue_id: parseInt(formData.venue_id),
      });

      if (result.success) {
        toast.success('Lapangan baru berhasil dibuat.');
        router.push('/admin/fields');
      } else {
        toast.error(result.message || 'Gagal membuat lapangan.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="py-6 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Field</h1>
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="venue_id">Venue</Label>
                  <select
                    id="venue_id"
                    name="venue_id"
                    value={formData.venue_id}
                    onChange={handleChange}
                    disabled={loadingVenues}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="" disabled>
                      {loadingVenues ? 'Memuat venues...' : 'Pilih Venue'}
                    </option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="name">Field Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Lapangan Indoor A"
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
                    placeholder="Deskripsi singkat lapangan..."
                  />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Save Field'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}