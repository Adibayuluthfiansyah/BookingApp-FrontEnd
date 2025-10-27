'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { NavLinks } from '@/components/Navbar/NavLinks'
import { AuthSection } from '@/components/Navbar/AuthSection'
import { MobileMenu } from '@/components/Navbar/MobileMenu'
import { NavLogo } from '@/components/Navbar/NavLogo'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Lapangan', href: '/venues' },
  { label: 'Kontak', href: '/contact' },
]

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
          : 'bg-black/30 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLogo isScrolled={isScrolled} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks
              items={navItems}
              pathname={pathname}
              isScrolled={isScrolled}
            />

            <AuthSection
              isScrolled={isScrolled}
              isAuthenticated={isAuthenticated}
              user={user}
            />
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
              isScrolled
                ? 'hover:bg-gray-100 text-black'
                : 'hover:bg-white/10 text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
        isAuthenticated={isAuthenticated}
        user={user}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  )
}

export default Navbar