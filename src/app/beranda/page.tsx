'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MOCK_VENUES } from '@/lib/utils';

export default function Beranda() {
  const featuredVenues = MOCK_VENUES.slice(0, 3);

  return (
      <section className="relative bg-black/80 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Booking Lapangan<br />
              <span className="text-blue-300">Mini Soccer & Futsal</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Temukan dan booking lapangan olahraga terbaik di sekitar Anda dengan mudah dan cepat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/venues">
                <Button size="lg" className="w-full sm:w-auto cursor-pointer hover:bg-white hover:text-black">
                  Cari Lapangan
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-black hover:bg-white hover:text-blue-600 cursor-pointer">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </section>
  );
}
 
