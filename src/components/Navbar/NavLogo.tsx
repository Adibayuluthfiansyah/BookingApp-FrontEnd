'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLogoProps {
  isScrolled: boolean;
}

export const NavLogo: React.FC<NavLogoProps> = ({ isScrolled }) => {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm p-1 -m-1 cursor-pointer hover:scale-105 transition-transform"
    >
      <div
        className={cn(
          "w-[150px] h-[120px]",
          "transition-colors duration-300",
          isScrolled ? 'bg-primary' : 'bg-white'
        )}
        style={{
          maskImage: 'url(/logobookingapp1.png)',
          WebkitMaskImage: 'url(/logobookingapp1.png)', 
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
    </Link>
  );
};