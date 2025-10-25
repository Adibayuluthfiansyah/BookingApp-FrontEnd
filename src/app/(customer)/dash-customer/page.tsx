'use client';

import { Card } from '@/components/ui/card';
import { useAuth } from '@/app/contexts/AuthContext'; // (Gunakan AuthContext Anda)
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const { user } = useAuth(); // Ambil data user yang sedang login

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4 pt-20">
        Selamat Datang, {user?.name || 'Customer'}!
      </h1>
      <p className="text-gray-600 mb-6">
        Ini adalah halaman dashboard Anda. Di sini Anda bisa melihat ringkasan aktivitas booking Anda.
      </p>

      {/* Contoh Kartu Cepat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Lihat Riwayat Booking</h3>
          <p className="text-sm text-gray-500 mb-4">
            Lihat semua booking yang pernah Anda buat.
          </p>
          <Link 
            href="/my-bookings" 
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Lihat Booking Saya &rarr;
          </Link>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Kelola Profil</h3>
          <p className="text-sm text-gray-500 mb-4">
            Perbarui informasi kontak atau kata sandi Anda.
          </p>
          <Link 
            href="/profile" 
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Lihat Profil Saya &rarr;
          </Link>
        </Card>
      </div>

      {/* (Anda bisa menambahkan ringkasan lain di sini nanti, misal booking aktif) */}

    </div>
  );
}