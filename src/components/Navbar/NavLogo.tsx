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

      <div className="flex flex-col leading-tight text-left">
        <span className={cn(
            "font-bold text-lg tracking-tight transition-colors duration-300",
            isScrolled ? 'text-foreground' : 'text-white'
          )}>
          O7ONG CORP
        </span>
        <span className={cn(
            "text-[10px] font-medium tracking-wider text-center uppercase transition-colors duration-300",
            isScrolled ? 'text-muted-foreground' : 'text-white/70'
          )}>
          Booking System
        </span>
      </div>
    </Link>
  );
};