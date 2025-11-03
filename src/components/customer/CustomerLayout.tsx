'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, User } from 'lucide-react';
import Navbar from '@/app/utilities/navbar/page'; 
import Footer from '@/app/utilities/footer/page';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; 
import { cn } from '@/lib/utils'; 

const menuItems = [
  { label: 'Booking Saya', icon: Calendar, path: '/my-bookings' },
  { label: 'Profile Saya', icon: User, path: '/profile' },
];

function CustomerLayoutSkeleton() {
  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-1">
              <Card className="p-4 border-border">
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <nav className="space-y-2">
                  <Skeleton className="h-12 w-full rounded-lg" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </nav>
              </Card>
            </aside>
            {/* Content Skeleton */}
            <main className="lg:col-span-3">
              <Skeleton className="h-64 w-full rounded-lg" />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <CustomerLayoutSkeleton />;
  }
  
  if (user.role !== 'customer') {
    router.push('/'); 
    return <CustomerLayoutSkeleton />; 
  }

  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Navigasi */}
            <aside className="lg:col-span-1 pt-10">
              <Card className="p-4 border-border">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        href={item.path} 
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition group",
                          isActive
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:bg-accent hover:text-accent-foreground" 
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </Card>
            </aside>

            {/* Konten Utama */}
            <main className="lg:col-span-3">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

