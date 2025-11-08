'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';


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
          <Image src="/logobookingapp1.png" alt="Logo" 
          width={100} 
          height={40} 
          />
        </span>
      </div>
    </Link>
  );
};