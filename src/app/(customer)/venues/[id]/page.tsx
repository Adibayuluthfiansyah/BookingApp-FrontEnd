'use client';

import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VenueDetailPage() {
  const { id } = useParams();

  // Mock detail
  const venue = {
    id,
    name: 'GOR Senayan Futsal',
    location: 'Jakarta',
    description: 'Lapangan futsal indoor dengan fasilitas lengkap.',
    price: 200000,
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 md:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{venue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">{venue.location}</p>
          <p className="mb-4">{venue.description}</p>
          <p className="text-lg font-semibold">Rp {venue.price.toLocaleString()} / jam</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href={`/booking?venueId=${venue.id}`}>Book Now</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
