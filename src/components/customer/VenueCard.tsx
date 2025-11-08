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
        "w-full overflow-hidden flex flex-col",
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        "border-border hover:border-primary/20 group",
        className
      )}
    >
      <Link 
        href={`/venues/${venue.slug || venue.id}`} 
        className="flex flex-col h-full"
      >
        {/* Bagian Gambar */}
        <CardHeader className="p-0 relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={venue.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/600x400/0a0a0a/999999?text=${venue.name.split(' ').join('+')}`;
            }}
          />
        </CardHeader>

        {/* Bagian Konten */}
        <CardContent className="p-4 space-y-3 flex-1">
          {/* Judul dan Harga */}
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-lg font-semibold tracking-tight line-clamp-2 flex-1">
              {venue.name}
            </CardTitle>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground whitespace-nowrap">Mulai dari</p>
              <p className="font-bold text-green-600 text-sm whitespace-nowrap">
                {minPrice > 0 ? formatCurrency(minPrice) : 'Hubungi'}
              </p>
            </div>
          </div>
          
          {/* Alamat */}
          <CardDescription className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-red-500" />
            <span className="line-clamp-1">{venue.address}</span>
          </CardDescription>

          {/* Deskripsi */}
          {venue.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {venue.description}
            </p>
          )}
          
          {/* Fasilitas */}
          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {facilities.slice(0, 3).map((facility: Facility) => (
                <Badge 
                  key={facility.id} 
                  variant="secondary" 
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
                >
                  {facility.name}
                </Badge>
              ))}
              {facilities.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs"
                >
                  +{facilities.length - 3} lainnya
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* Bagian Footer */}
        <CardFooter className="p-4 flex justify-between items-center border-t border-border/20">
          {/* Jumlah Lapangan */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Layers className="mr-1.5 h-4 w-4" />
            <span>
              {fieldsCount} {fieldsCount === 1 ? 'lapangan' : 'lapangan'}
            </span>
          </div>

          {/* Tombol */}
          <Button 
            asChild 
            variant="ghost" 
            size="sm" 
            className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="flex items-center">
              Lihat Detail <ArrowRight className="ml-1.5 h-4 w-4" />
            </span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}