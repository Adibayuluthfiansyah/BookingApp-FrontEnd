'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { NavLinks } from '@/components/Navbar/NavLinks';
import AuthSection from '@/components/Navbar/AuthSection';
import { MobileMenu } from '@/components/Navbar/MobileMenu';
import { NavLogo } from '@/components/Navbar/NavLogo';
import { cn } from '@/lib/utils'; 

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Lapangan', href: '/venues' },
  { label: 'Kontak', href: '/contact' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? 'bg-background/90 backdrop-blur-md shadow-sm border-b border-border' 
          : 'bg-gradient-to-b from-black/60 via-black/30 to-transparent border-b border-transparent' 
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="flex items-center justify-between h-16">
          <NavLogo isScrolled={isScrolled} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks
              items={navItems}
              pathname={pathname}
              isScrolled={isScrolled}
            />
            <div className="w-px h-6 bg-border mx-2"></div> 
            <AuthSection isScrolled={isScrolled} />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              isScrolled
                ? 'text-foreground hover:bg-accent'
                : 'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
        isAuthenticated={isAuthenticated}
        user={user}
        onClose={() => setIsMobileMenuOpen(false)}
        isScrolled={isScrolled} 
      />
    </nav>
  );
};

export default Navbar;