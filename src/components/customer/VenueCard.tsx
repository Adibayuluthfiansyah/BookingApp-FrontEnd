import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Venue } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Gambar */}
      <div className="relative h-48">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium">
          ⭐ {venue.rating}
        </div>
      </div>
      
      {/* Konten */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
        <p className="text-gray-600 mb-2">{venue.address}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{venue.description}</p>
        
        {/* Fasilitas */}
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.facilities.slice(0, 3).map((facility, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {facility}
            </span>
          ))}
          {venue.facilities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{venue.facilities.length - 3} lainnya
            </span>
          )}
        </div>

        {/* Harga + Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Mulai dari</span>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(venue.price_per_hour)}/jam
            </p>
          </div>
          <Link href={`/venues/${venue.id}`}>
            <Button>Lihat Detail</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
