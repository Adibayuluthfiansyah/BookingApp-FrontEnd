'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { Field } from '@/types'; 
import { getAdminFields, deleteAdminField } from '@/lib/api'; 

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminFields(); 
      if (result.success && result.data) {
        setFields(result.data);
      } else {
        setError(result.message || 'Gagal mengambil data lapangan.');
        toast.error(result.message || 'Gagal mengambil data lapangan.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
      toast.error('Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      return;
    }

    try {
      const result = await deleteAdminField(id); 
      if (result.success) {
        toast.success('Lapangan berhasil dihapus.');
        loadFields(); 
      } else {
        toast.error(result.message || 'Gagal menghapus lapangan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat menghapus.');
    }
  };
  
  const handleAddField = () => {
    toast.info('Fitur "Add Field" belum diimplementasikan.');
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-12">
            <h1 className="text-2xl font-semibold text-gray-900">Field Management</h1>
            <Button onClick={handleAddField}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>

          {/* Konten Utama */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="text-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data lapangan...</p>
              </div>
            ) : error ? (
              <div className="text-center p-12 text-red-600">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="font-semibold">Gagal Memuat Data</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <Button onClick={loadFields}>Coba Lagi</Button>
              </div>
            ) : fields.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-600">Belum ada data lapangan yang ditambahkan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map(field => (
                      <tr key={field.id}>
                        <td className="px-6 py-4">{field.id}</td>
                        <td className="px-6 py-4 font-medium">{field.name}</td>
                        <td className="px-6 py-4">{field.venue?.name || 'N/A'}</td>
                        <td className="px-6 py-4 capitalize">{field.field_type || 'N/A'}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toast.info('Fitur "Edit" belum ada.')}>Edit</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(field.id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}