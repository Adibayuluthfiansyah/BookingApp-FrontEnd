'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader,CardContent} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogClose,} from "@/components/ui/dialog"; 
import { toast } from 'sonner';
import { AlertCircle, PlusCircle, Loader2, Search, Edit, Trash2 , MapPin} from 'lucide-react';
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
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = useMemo(() => venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (venue.address && venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [venues, searchTerm]);

  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (venueToDelete) {
      setIsDeleting(true);
      try {
        const result = await deleteVenue(venueToDelete.id);
        if (result.success) {
          toast.success(`Venue "${venueToDelete.name}" berhasil dihapus.`);
          setShowDeleteModal(false);
          setVenueToDelete(null);
          loadVenues(); // Muat ulang daftar venue
        } else {
          toast.error(result.message || 'Gagal menghapus venue.');
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin h-12 w-12 text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-12 text-destructive">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="font-semibold mb-2">Gagal Memuat Data</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadVenues} variant="destructive" >Coba Lagi</Button>
        </div>
      );
    }

    if (venues.length === 0) {
        return (
            <div className="text-center p-12">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Belum ada venue yang ditambahkan.</p>
                <Button asChild>
                  <Link href="/admin/venues/create">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Tambah Venue Pertama
                  </Link>
                </Button>
              </div>
        );
    }

    return (
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[250px]">Venue</TableHead>
                <TableHead className="min-w-[200px]">Lokasi</TableHead>
                <TableHead>Total Lapangan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVenues.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Tidak ada venue yang cocok dengan pencarian {searchTerm}.
                    </TableCell>
                </TableRow>
              )}
              {filteredVenues.map((venue) => (
                <TableRow key={venue.id} className="hover:bg-accent/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden relative flex-shrink-0 bg-muted">
                        <Image
                          src={venue.image_url || '/placeholder.jpg'} 
                          alt={venue.name}
                          fill
                          className="object-cover"
                          onError={(e) => { e.currentTarget.src = `https://placehold.co/80x80/f0f0f0/999999?text=Img`; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {venue.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate" title={venue.description}>
                          {venue.description || 'Tanpa deskripsi'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground truncate" title={venue.address}>
                      {venue.address || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {venue.city || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border">
                      {venue.fields?.length || 0} Lapangan
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* (Asumsi status, bisa disesuaikan jika ada di API) */}
                    <Badge variant="secondary" className="bg-green-600/10 text-green-700 border-green-600/20">
                      Aktif
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button asChild variant="outline" size="icon" className="h-8 w-8">
                        <Link href={`/admin/venues/edit/${venue.id}`}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteClick(venue)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Hapus</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    );
  };

  return (
    <AdminLayout>
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Manajemen Venue</h1>
          <p className="text-muted-foreground text-sm">Kelola semua venue dan lapangan Anda.</p>
        </div>
        <Button asChild>
          <Link href="/admin/venues/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tambah Venue Baru
          </Link>
        </Button>
      </div>

      {/* Search & Konten */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari venue berdasarkan nama atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        {renderContent()}
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Venue?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus venue <strong>{venueToDelete?.name}</strong>?
              Tindakan ini akan menghapus semua lapangan, slot waktu, dan data booking terkait.
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setVenueToDelete(null)}>Batal</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
}