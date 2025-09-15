'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');
  const name = searchParams.get('name');

  return (
    <div className="max-w-lg mx-auto py-10 px-4 sm:px-6 md:px-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmed 🎉</h1>
      <p className="mb-2">Thank you, <span className="font-semibold">{name}</span>.</p>
      <p className="mb-6">Your booking for venue ID <span className="font-semibold">{venueId}</span> has been confirmed.</p>
      <Button asChild>
        <a href="/profile">Go to Profile</a>
      </Button>
    </div>
  );
}
