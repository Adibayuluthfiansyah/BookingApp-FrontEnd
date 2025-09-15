'use client';

import { useState, useEffect } from 'react';
import LoadingAnimation from '../loading/page';
import Navbar from '../navbar/page';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <LoadingAnimation 
          isLoading={isLoading} 
          onComplete={() => setIsLoading(false)}
        />
      )}
      <Navbar />
      {children}
    </>
  );
}