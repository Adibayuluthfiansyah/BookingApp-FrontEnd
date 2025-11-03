'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertCircle, Check, CheckCheck, Loader2 } from 'lucide-react';
import { getMyVenues, getAllFacilities, getVenueFacilities, syncVenueFacilities } from '@/lib/api';
import { Facility } from '@/types'; 
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox'; 


interface SimpleVenue {
  id: number;
  name: string;
}

export default function AdminFacilitiesPage() {
  const [venues, setVenues] = useState<SimpleVenue[]>([]);
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [venueFacilities, setVenueFacilities] = useState<number[]>([]); 
  
  const [loading, setLoading] = useState(true);
  const [loadingVenueFacilities, setLoadingVenueFacilities] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
    const loadMasterData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [venuesResult, facilitiesResult] = await Promise.all([
          getMyVenues(),
          getAllFacilities(),
        ]);
        const errorMessages: string[] = [];
        if (venuesResult.success && venuesResult.data) {
          setVenues(venuesResult.data);
        } else {
          errorMessages.push(venuesResult.message || 'Gagal mengambil data venue.');
        }
        if (facilitiesResult.success && facilitiesResult.data) {
          setAllFacilities(facilitiesResult.data);
        } else {
          errorMessages.push(facilitiesResult.message || 'Gagal mengambil data fasilitas.');
        }
        if (errorMessages.length > 0) {
          setError(errorMessages.join(' '));
        }
      } catch (err: unknown) { 
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data master.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadMasterData();
  }, []);

  useEffect(() => {
    // Load fasilitas milik venue SETELAH venue dipilih
    if (!selectedVenueId) {
      setVenueFacilities([]); // Kosongkan jika tidak ada venue dipilih
      return;
    }

    const loadVenueFacilitiesData = async () => {
      setLoadingVenueFacilities(true);
      try {
        const result = await getVenueFacilities(Number(selectedVenueId));
        if (result.success && result.data) {
          setVenueFacilities(result.data);
        } else {
          toast.error('Gagal memuat fasilitas venue', { description: result.message });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat fasilitas venue.';
        toast.error('Error', { description: message });
      } finally {
        setLoadingVenueFacilities(false);
      }
    };

    loadVenueFacilitiesData();
  }, [selectedVenueId]); 

  const handleCheckboxChange = (facilityId: number, checked: boolean) => {
    setVenueFacilities((prev) => {
      if (checked) {
        // Tambahkan ID ke array jika belum ada
        return [...prev, facilityId];
      } else {
        // Hapus ID dari array
        return prev.filter((id) => id !== facilityId);
      }
    });
  };

  const handleSave = async () => {
    if (!selectedVenueId) {
      toast.error('Silakan pilih venue terlebih dahulu.');
      return;
    }

    setSaving(true);
    try {
      // Kirim array 'venueFacilities' (yang berisi ID) ke backend
      const result = await syncVenueFacilities(Number(selectedVenueId), venueFacilities);
      if (result.success) {
        toast.success('Fasilitas venue berhasil diperbarui!', {
          icon: <CheckCheck className="w-5 h-5" />,
        });
      } else {
        toast.error('Gagal menyimpan', { description: result.message });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan fasilitas venue.';
      toast.error('Error', { description: message });
    } finally {
      setSaving(false);
    }
  };
  
  const selectedVenueName = venues.find(v => v.id === Number(selectedVenueId))?.name || "";

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="mb-6 pt-12">
            <h1 className="text-2xl font-semibold text-gray-900">Facility Management</h1>
            <p className="text-gray-600">Atur fasilitas untuk setiap venue</p>
          </div>

          {loading ? (
            <div className="text-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data master...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 text-red-600">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="font-semibold">Gagal Memuat Data</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
            </div>
          ) : (
            <Card>
              <div className="p-6 space-y-6">
                {/* 1. Pilih Venue */}
                <div>
                  <Label htmlFor="venue-select" className="text-lg font-medium">Pilih Venue</Label>
                  <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
                    <SelectTrigger id="venue-select">
                      <SelectValue placeholder="Pilih venue untuk dikelola..." />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={String(venue.id)}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Daftar Fasilitas (Checkbox) */}
                {selectedVenueId && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">
                      Fasilitas untuk: <span className="text-orange-600">{selectedVenueName}</span>
                    </h3>
                    
                    {loadingVenueFacilities ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allFacilities.map((facility) => (
                          <div key={facility.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                            <Checkbox
                              id={`facility-${facility.id}`}
                              checked={venueFacilities.includes(facility.id)}
                              onCheckedChange={(checked) => handleCheckboxChange(facility.id, checked as boolean)}
                            />
                            <Label htmlFor={`facility-${facility.id}`} className="cursor-pointer">
                              {facility.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* 3. Tombol Simpan */}
              {selectedVenueId && (
                <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                  <Button onClick={handleSave} disabled={saving || loadingVenueFacilities}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    {saving ? 'Menyimpan...' : 'Save Changes'}
                  </Button>
                </div>
              )}

            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}