'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingAnimation from '../loading/page';
import Navbar from '../navbar/page';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cek apakah halaman admin
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {isLoading && (
        <LoadingAnimation
          isLoading={isLoading}
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Tampilkan Navbar hanya kalau BUKAN admin */}
      {!isAdminRoute && <Navbar />}

      {children}
    </>
  );
}
