'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function UserProfilePage() {
  const mockUser = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    bookings: [
      { id: 1, venue: 'GOR Senayan Futsal', date: '2025-09-20', time: '18:00', duration: 2 },
      { id: 2, venue: 'Futsal Center Bandung', date: '2025-09-25', time: '20:00', duration: 1 },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 md:px-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          <p><span className="font-semibold">Name:</span> {mockUser.name}</p>
          <p><span className="font-semibold">Email:</span> {mockUser.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockUser.bookings.map(b => (
            <div key={b.id} className="p-3 border rounded-lg">
              <p className="font-semibold">{b.venue}</p>
              <p>{b.date} at {b.time} ({b.duration}h)</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
