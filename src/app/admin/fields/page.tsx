'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Field } from '@/types';
import { getAdminFields, deleteAdminField } from '@/lib/api';

export default function AdminFieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<Field | null>(null);

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
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteClick = (field: Field) => {
    setFieldToDelete(field);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!fieldToDelete) return;

    try {
      const result = await deleteAdminField(fieldToDelete.id);
      if (result.success) {
        toast.success(`Lapangan "${fieldToDelete.name}" berhasil dihapus.`);
        loadFields(); 
      } else {
        toast.error(result.message || 'Gagal menghapus lapangan.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat menghapus.');
    } finally {
      setShowDeleteModal(false);
      setFieldToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-12">
            <h1 className="text-2xl font-semibold text-gray-900">Field Management</h1>
            <Button asChild>
              <Link href="/admin/fields/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Field
              </Link>
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
                <Button asChild className="mt-4">
                  <Link href="/admin/fields/create">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Lapangan Pertama
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map(field => (
                      <tr key={field.id}>
                        <td className="px-6 py-4 font-medium">{field.name}</td>
                        <td className="px-6 py-4">{field.venue?.name || 'N/A'}</td>
                        <td className="px-6 py-4 capitalize">{field.field_type || 'N/A'}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {/* (PERBAIKAN) Gunakan <Link> untuk ke halaman 'edit' */}
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/fields/edit/${field.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(field)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* (PERBAIKAN) Modal Konfirmasi Delete */}
      {showDeleteModal && fieldToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Field
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus lapangan <strong>{fieldToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}