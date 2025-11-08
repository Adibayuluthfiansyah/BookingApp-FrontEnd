'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getAllVenues } from '@/lib/api';
import { Venue } from '@/types';
import Footer from "./utilities/footer/page"; 
import Hero from "./hero/page"; 
import { VenueCard } from "@/components/customer/VenueCard"; 
import { VenueCardSkeleton } from "@/components/customer/VenueCardSkleton";
import { Button } from "@/components/ui/button"; 
import { ArrowRight, AlertTriangle } from "lucide-react"; 

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getAllVenues();
      console.log('Homepage venues result:', result);

      if (result.success && result.data) {
        setVenues(result.data.slice(0, 3));
      } else {
        setError(result.message || 'Gagal memuat data lapangan');
      }
    } catch (err) {
      console.error('Error loading venues:', err);
      setError('Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full text-center py-12 flex flex-col items-center gap-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={loadVenues}>
            Coba Lagi
          </Button>
        </div>
      );
    }

    if (venues.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="col-span-full text-center py-12 text-muted-foreground">
        Belum ada lapangan tersedia
      </div>
    );
  };

  return (
    <div className="bg-background">
      <Hero />
      <section className="container mx-auto py-16 px-6">
        {/* Header untuk Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Pilihan Teratas</h2>
            <p className="text-muted-foreground">
              Lapangan terbaik yang paling sering dibooking.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="/venues">
              Lihat Semua Lapangan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {renderContent()}

        {/* Tombol "Lihat Semua" untuk mobile */}
        <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
                <Link href="/venues">
                Lihat Semua Lapangan
                <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>

      </section>
      
      <Footer />
    </div>
  );
}