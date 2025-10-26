'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAdminVenues, deleteVenue } from '@/lib/api';
import { Venue } from '@/types'; 
import Image from 'next/image';

export default function AdminVenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAdminVenues(); 
      if (result.success && result.data) {
        setVenues(result.data);
      } else {
        setError(result.message || 'Gagal mengambil data venue.');
        toast.error(result.message || 'Gagal mengambil data venue.');
      }
    } catch (err: any) {
      const message = err.message || 'Terjadi kesalahan saat memuat data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (venue.address && venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteVenue = (venueId: number) => {
    setVenueToDelete(venueId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (venueToDelete) {
      try {
        const result = await deleteVenue(venueToDelete); 
        if (result.success) {
          toast.success('Venue berhasil dihapus.');
          setShowDeleteModal(false);
          setVenueToDelete(null);
          loadVenues(); // Muat ulang daftar venue
        } else {
          toast.error(result.message || 'Gagal menghapus venue.');
        }
      } catch (err: any) {
        toast.error(err.message || 'Terjadi kesalahan saat menghapus.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-12">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Venue Management</h1>
              <p className="text-gray-600">Kelola semua venue dan lapangan</p>
            </div>
            <Button asChild>
              <Link href="/admin/venues/create" className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Venue
              </Link>
            </Button>
          </div>

          {/* Search Card */}
          <Card className="p-6 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari venue berdasarkan nama atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </Card>

          {/* Venues Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="text-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data venue...</p>
              </div>
            ) : error ? (
              <div className="text-center p-12 text-red-600">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="font-semibold">Gagal Memuat Data</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <Button onClick={loadVenues}>Coba Lagi</Button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Venues ({filteredVenues.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Venue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Fields
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVenues.map((venue) => (
                        <tr key={venue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-xl overflow-hidden relative flex-shrink-0">
                                <Image
                                  src={venue.image_url || '/placeholder-image.jpg'}
                                  alt={venue.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {venue.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {venue.description || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {venue.address || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {venue.city || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {/* (PERBAIKAN) Hitung dari relasi 'fields' */}
                              {venue.fields?.length || 0} fields
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* (Asumsi status, bisa disesuaikan jika ada di API) */}
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              {/* === INI BAGIAN YANG DIPERBAIKI === */}
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/venues/edit/${venue.id}`}>
                                  Edit
                                </Link>
                              </Button>
                              {/* === AKHIR PERBAIKAN === */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteVenue(venue.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Venue
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus venue ini? Tindakan ini akan menghapus semua lapangan dan data terkait.
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