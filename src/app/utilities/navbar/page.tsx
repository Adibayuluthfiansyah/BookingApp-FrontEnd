'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, } from 'lucide-react'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/tentang' },
  { label: 'Lapangan', href: '/venues' },
  { label: 'Kontak', href: '/kontak' },
]

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xl border-b border-[#4a5c4d]/10'
          : 'bg-black/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 text-xl font-bold tracking-wide transition-all duration-300 hover:scale-101 ${
              isScrolled ? 'text-[#2d3b2f]' : 'text-white'
            }`}
          >
            {/* <div className={`p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-br from-[#2d3b2f] to-[#4a5c4d]' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
            </div> */}
            <span className="hidden sm:block">070NG BOOKING</span>
            <span className="sm:hidden">070NG</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 relative group ${
                  pathname === item.href
                    ? isScrolled
                      ? 'text-white bg-gradient-to-r from-[#2d3b2f] to-[#4a5c4d] shadow-lg'
                      : 'text-[#2d3b2f] bg-white/90 backdrop-blur-sm shadow-lg'
                    : isScrolled
                    ? 'text-[#6b7069] hover:text-[#2d3b2f] hover:bg-[#4a5c4d]/5'
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-60"></div>
                )}
              </Link>
            ))}
          </div>


          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden focus:outline-none p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'hover:bg-[#4a5c4d]/10 text-[#2d3b2f]' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {isMobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-xl border-t border-[#4a5c4d]/10">
          <div className="px-4 py-6 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === item.href
                    ? 'text-white bg-gradient-to-r from-[#2d3b2f] to-[#4a5c4d] shadow-lg'
                    : 'text-[#6b7069] hover:text-[#2d3b2f] hover:bg-[#4a5c4d]/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/kontak"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2d3b2f] to-[#4a5c4d] text-white font-bold text-center transition-all duration-300 hover:shadow-lg"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
