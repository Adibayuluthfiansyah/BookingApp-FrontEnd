'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, PlusCircle, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { getAdminTimeSlots, deleteTimeSlot, getMyFieldsList } from '@/lib/api';
import { TimeSlot, SimpleField } from '@/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; 

// Helper format harga
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper format jam
const formatTime = (timeStr: string) => {
  if (!timeStr) return 'N/A';
  return timeStr.substring(0, 5); // "08:00:00" -> "08:00"
}

export default function AdminTimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [fields, setFields] = useState<SimpleField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string>('all');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<number | null>(null);

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [slotsResult, fieldsResult] = await Promise.all([
        getAdminTimeSlots(),
        getMyFieldsList(),
      ]);

      if (slotsResult.success && slotsResult.data) {
        setTimeSlots(slotsResult.data);
      } else {
        setError(slotsResult.message || 'Gagal mengambil data time slot.');
      }

      if (fieldsResult.success && fieldsResult.data) {
        setFields(fieldsResult.data);
      } else {
        setError(
          (prevError) => (prevError ? prevError + ' ' : '') + (fieldsResult.message || 'Gagal mengambil data lapangan.'));
      }
    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Gunakan useMemo agar filtering tidak berjalan di setiap render
  const filteredSlots = useMemo(() => {
    if (selectedField === 'all') {
      return timeSlots;
    }
    return timeSlots.filter(
      (slot) => slot.field_id === parseInt(selectedField, 10)
    );
  }, [selectedField, timeSlots]);


  const handleDeleteSlot = (slotId: number) => {
    setSlotToDelete(slotId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (slotToDelete) {
      try {
        const result = await deleteTimeSlot(slotToDelete); 
        if (result.success) {
          toast.success('Time slot berhasil dihapus.');
          setShowDeleteModal(false);
          setSlotToDelete(null);
          loadInitialData(); // Muat ulang daftar
        } else {
          toast.error(result.message || 'Gagal menghapus slot.');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus.';
        toast.error(message);
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
              <h1 className="text-2xl font-semibold text-gray-900">Time Slot Management (Harga)</h1>
              <p className="text-gray-600">Kelola jam buka dan harga untuk setiap lapangan</p>
            </div>
            <Button asChild>
              <Link href="/admin/timeslots/create" className="flex items-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Time Slot
              </Link>
            </Button>
          </div>

          {/* Filter Card */}
          <Card className="p-6 mb-6">
            <Label htmlFor="field-filter" className="mb-2 block">Filter Berdasarkan Lapangan</Label>
            <Select value={selectedField} onValueChange={setSelectedField} disabled={loading}>
              <SelectTrigger id="field-filter" className="w-full md:w-1/2">
                <SelectValue placeholder="Pilih Lapangan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Lapangan</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={String(field.id)}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Time Slots Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="text-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data slot...</p>
              </div>
            ) : error ? (
              <div className="text-center p-12 text-red-600">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="font-semibold">Gagal Memuat Data</p>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <Button onClick={loadInitialData}>Coba Lagi</Button>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    All Time Slots ({filteredSlots.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lapangan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Waktu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSlots.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="text-center py-10 text-gray-500">
                             {selectedField === 'all' ? 'Tidak ada time slot.' : 'Tidak ada time slot untuk lapangan ini.'}
                           </td>
                        </tr>
                      ) : (
                        filteredSlots.map((slot) => (
                          <tr key={slot.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {slot.field?.venue?.name || 'Venue...'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {slot.field?.name || 'Lapangan...'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-700">
                                {formatCurrency(slot.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Button asChild variant="outline" size="icon">
                                  <Link href={`/admin/timeslots/edit/${slot.id}`}>
                                    <Edit className="w-4 h-4" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteSlot(slot.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
              Delete Time Slot
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus slot waktu ini? (Ini mungkin gagal jika slot sudah pernah dibooking).
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