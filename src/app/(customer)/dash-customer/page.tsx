'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent,CardFooter} from '@/components/ui/card';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout'; 
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerDashboardPage() {
  const { user } = useAuth(); 

  return (

    <CustomerLayout>
      <h1 className="text-2xl font-bold text-foreground mb-4 pt-8">
        Selamat Datang, {user?.name || 'Customer'}!
      </h1>
      <p className="text-muted-foreground mb-6">
        Ini adalah halaman dashboard Anda. Di sini Anda bisa melihat ringkasan aktivitas booking Anda.
      </p>

      {/* Kartu Cepat (Gunakan komponen Shadcn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Riwayat Booking */}
        <Card className="border-border flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lihat Riwayat Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lihat semua booking yang pernah Anda buat, cek status pembayaran,
                dan detail jadwal main Anda.
              </CardDescription>
            </CardContent>
          </div>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/my-bookings">
                Lihat Booking Saya <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Card Kelola Profil */}
        <Card className="border-border flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Kelola Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Perbarui informasi kontak, email, atau kata sandi Anda agar
                tetap aman dan terbaru.
              </CardDescription>
            </CardContent>
          </div>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/profile">
                Lihat Profil Saya <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

      </div>
    </CustomerLayout>
  );
}

