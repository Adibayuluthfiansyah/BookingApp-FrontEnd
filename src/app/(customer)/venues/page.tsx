'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'; 
import Navbar from '@/app/utilities/navbar/page'; 
import Footer from '@/app/utilities/footer/page';
import { getAllVenues } from '@/lib/api'; 
import { Venue } from '@/types';
import { VenueCard } from '@/components/customer/VenueCard'; 
import { VenueCardSkeleton } from '@/components/customer/VenueCardSkleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select"; 
import { Search, AlertTriangle, XCircle } from 'lucide-react';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    venues.forEach((v) => {
      v.fields?.forEach((f) => {
        allCategories.add(f.field_type || 'Lainnya');
      });
    });
    return ['all', ...Array.from(allCategories)];
  }, [venues]);

  const loadVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllVenues();
      if (result.success && result.data) {
        setVenues(result.data);
      } else {
        setError(result.message || 'Gagal memuat data lapangan');
      }
    } catch (err) {
      console.error('Error loading venues:', err);
      setError('Terjadi kesalahan saat menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);


  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const categoryMatch =
        selectedCategory === 'all' ||
        (venue.fields && venue.fields.some(f => (f.field_type || 'Lainnya') === selectedCategory));

      const searchTermMatch =
        searchTerm === '' ||
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchTermMatch;
    });
  }, [venues, searchTerm, selectedCategory]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-12 flex flex-col items-center gap-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <h3 className="text-xl font-semibold">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={loadVenues}>
            Coba Lagi
          </Button>
        </div>
      );
    }

    if (filteredVenues.length === 0) {
      return (
        <div className="col-span-full text-center py-12 flex flex-col items-center gap-4">
          <XCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-xl font-semibold">Tidak Ada Lapangan Ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau filter Anda.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      
      <div className='relative h-80 md:h-96 overflow-hidden pt-14'>
        <div className='absolute inset-0'>
          <Image 
            src='/lapanganpage.jpg' 
            fill 
            alt="Lapangan background"
            className='object-cover w-full h-full'
            priority
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/1920x400/0a0a0a/999999?text=Venues`;
            }}
          />
        </div>
        <div className='absolute inset-0 bg-black/60'></div>
        <div className='relative z-10 flex items-center justify-center h-full text-center text-white px-4'>
          <div>
            <h1 className='text-4xl md:text-6xl font-bold mb-4'>Cari Lapangan</h1>
            <p className='text-lg md:text-xl'>Temukan lapangan futsal dan mini soccer terbaik di sekitar Anda</p>
          </div>
        </div>
      </div>
      <main className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-14 z-40 bg-background py-4 border-b border-border">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <Input 
                placeholder="Cari berdasarkan nama atau alamat..."
                className="pl-10 h-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px] h-10">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category === 'all' ? 'Semua Kategori' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Grid */}
          <div className="mt-10">
            {renderContent()}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}