import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight, Layers } from "lucide-react";
import { Venue, Facility } from "@/types";
import { cn } from "@/lib/utils";

interface VenueCardProps {
  venue: Venue;
  className?: string;
}

const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

const getMinPrice = (venue: Venue) => {
  if (!venue.fields || venue.fields.length === 0) {
    return 0;
  }
  
  let minPrice = Infinity;
  
  venue.fields.forEach(field => {
    const slots = field.time_slots || [];
    if (slots && slots.length > 0) {
      slots.forEach(slot => {
        const price = Number(slot.price);
        if (!isNaN(price) && price < minPrice) {
          minPrice = price;
        }
      });
    }
  });
  
  return minPrice === Infinity ? 0 : minPrice;
}

const getImageUrl = (venue: Venue) => {
  if (venue.image_url) {
    return venue.image_url;
  }
  if (venue.images && venue.images.length > 0 && venue.images[0].image_url) {
    return venue.images[0].image_url;
  }
  return `https://placehold.co/600x400/0a0a0a/999999?text=${venue.name.split(' ').join('+')}`;
}

export function VenueCard({ venue, className }: VenueCardProps) {
  const minPrice = getMinPrice(venue);
  const imageUrl = getImageUrl(venue);
  const facilities = venue.facilities || [];
  const fieldsCount = venue.fields?.length || 0;

  return (
    <Card 
      className={cn(
        "w-full overflow-hidden flex flex-col justify-between",
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        "border-border hover:border-primary/20 group grid",
        className
      )}
    >

      <Link 
        href={`/venues/${venue.slug || venue.id}`} 
        className="flex flex-col justify-between h-full"
      >
        <div>
          {/* Bagian Gambar */}
          <CardHeader className="p-0 relative h-48 w-full">
            <Image
              src={imageUrl}
              alt={venue.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback jika URL gambar error
                e.currentTarget.src = `https://placehold.co/600x400/0a0a0a/999999?text=${venue.name.split(' ').join('+')}`;
              }}
            />
          </CardHeader>

          {/* Bagian Konten */}
          <CardContent className="p-4 space-y-2">
            {/* Judul dan Harga */}
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg font-semibold tracking-tight line-clamp-2">
                {venue.name}
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Mulai dari</p>
                <p className="font-bold text-green-600">
                  {minPrice > 0 ? formatCurrency(minPrice) : 'Hubungi'}
                </p>
              </div>
            </div>
            
            {/* Alamat */}
            <CardDescription className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1.5 h-4 w-4" />
              <span className="truncate">{venue.address}</span>
            </CardDescription>

            {/* Deskripsi (dari VenuesCard) */}
            <p className="text-sm text-muted-foreground pt-1 line-clamp-2">
              {venue.description}
            </p>
            
            {/* Fasilitas (dari VenuesCard) */}
            {facilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {facilities.slice(0, 3).map((facility: Facility) => (
                  <Badge key={facility.id} variant="secondary" className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {facility.name}
                  </Badge>
                ))}
                {facilities.length > 3 && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{facilities.length - 3} lainnya
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </div>

        {/* Bagian Footer */}
        <CardFooter className="p-4 flex justify-between items-center border-t border-border/20 mt-2">
          {/* Jumlah Lapangan (dari VenuesCard) */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Layers className="mr-1.5 h-4 w-4" />
            <span>
              {fieldsCount} {fieldsCount === 1 ? 'lapangan' : 'lapangan'}
            </span>
          </div>

          {/* Tombol (terlihat saat hover) */}
          <Button asChild variant="ghost" size="sm" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>
              Lihat Detail <ArrowRight className="ml-1.5 h-4 w-4" />
            </span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}