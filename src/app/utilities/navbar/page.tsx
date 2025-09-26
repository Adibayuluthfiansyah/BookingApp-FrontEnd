'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, User } from 'lucide-react'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Lapangan', href: '/venues' },
  { label: 'Kontak', href: '/contact' },
]

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLoginMenu, setShowLoginMenu] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-black/5'
          : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all duration-500 hover:scale-105 ${
              isScrolled ? 'text-black' : 'text-white'
            }`}
          >
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight leading-none">
                KASHMIR
              </span>
              <span className={`text-xl font-medium tracking-widest uppercase ${
                isScrolled ? 'text-gray-600' : 'text-white/80'
              }`}>
                BOOKING
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 overflow-hidden group ${
                  pathname === item.href
                    ? isScrolled
                      ? 'text-white bg-black shadow-lg shadow-black/20'
                      : 'text-black bg-white/95 backdrop-blur-sm shadow-lg shadow-white/10'
                    : isScrolled
                    ? 'text-gray-700 hover:text-black hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {pathname !== item.href && (
                  <div className={`absolute inset-0 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full ${
                    isScrolled 
                      ? 'bg-gray-50' 
                      : 'bg-white/5 backdrop-blur-sm'
                  }`}></div>
                )}
              </Link>
            ))}
            
            {/* Login Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                  isScrolled
                    ? 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    : 'text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                }`}
              >
                <User size={18} />
                <span>Login</span>
              </button>
              
              {/* Dropdown Menu */}
              {showLoginMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <Link
                    href="/admin/login"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Shield size={18} />
                    <span className="font-medium">Admin Login</span>
                  </Link>
                  <Link
                    href="/customer/login"
                    onClick={() => setShowLoginMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors duration-200"
                  >
                    <User size={18} />
                    <span className="font-medium">Customer Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden focus:outline-none p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              isScrolled 
                ? 'hover:bg-gray-100 text-black' 
                : 'hover:bg-white/10 text-white'
            }`}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100'}`}>
                <Menu size={24} />
              </span>
              <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'}`}>
                <X size={24} />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="bg-white/98 backdrop-blur-xl shadow-2xl border-t border-black/5">
          <div className="px-6 py-8 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2 ${
                  pathname === item.href
                    ? 'text-white bg-black shadow-lg shadow-black/10'
                    : 'text-gray-700 hover:text-black hover:bg-gray-50'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: isMobileMenuOpen ? 'slideInFromRight 0.5s ease-out forwards' : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Login Section */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <p className="px-6 text-sm font-semibold text-gray-500 uppercase tracking-wider">Login</p>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2"
              >
                <Shield size={20} />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                href="/customer/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-green-600 hover:text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2"
              >
                <User size={20} />
                <span>Customer Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showLoginMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLoginMenu(false)}
        />
      )}
    </nav>
  )
}

export default Navbar