'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockVenues = [
  { id: 1, name: 'GOR Senayan Futsal', location: 'Jakarta', price: 200000 },
  { id: 2, name: 'Futsal Center Bandung', location: 'Bandung', price: 150000 },
  { id: 3, name: 'Lapangan Indoor Surabaya', location: 'Surabaya', price: 180000 },
];

export default function CustomerHomePage() {
  const [venues] = useState(mockVenues);

  return (
    <div className="pt-22 py-15 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Available Venues</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map(venue => (
          <Card key={venue.id}>
            <CardHeader>
              <CardTitle>{venue.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{venue.location}</p>
              <p className="text-lg font-semibold mt-2">Rp {venue.price.toLocaleString()} / jam</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href={`/venues/${venue.id}`}>View Details</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
