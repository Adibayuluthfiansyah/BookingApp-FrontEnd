'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookingFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId');

  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    duration: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/booking/confirmation?venueId=${venueId}&name=${form.name}`);
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Booking Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Your Name</Label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Time</Label>
          <Input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Duration (hours)</Label>
          <Input
            type="number"
            min={1}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
            required
          />
        </div>

        <Button type="submit" className="w-full">Confirm Booking</Button>
      </form>
    </div>
  );
}
