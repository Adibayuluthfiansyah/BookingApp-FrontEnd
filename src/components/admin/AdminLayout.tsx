'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      if (user.role === 'admin' || user.role === 'super_admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.push('/');
      }
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn(
      "grid min-h-screen w-full bg-background",
      "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
    )}>
      
      {/* Sidebar (Desktop) */}
      <AdminSidebar />
      
      {/* Konten Utama */}
      <div className="flex flex-col">
        <AdminHeader />
        
        <main className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:gap-6 lg:p-6 bg-muted/30 dark:bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}