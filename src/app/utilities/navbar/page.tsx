'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, ChevronDown } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'sonner'

const navItems = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/about' },
  { label: 'Lapangan', href: '/venues' },
  { label: 'Kontak', href: '/contact' },
]

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout berhasil')
      router.push('/')
      setIsProfileDropdownOpen(false)
      setIsMobileMenuOpen(false)
    } catch (error) {
      toast.error('Logout gagal')
    }
  }

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard'
    if (user?.role === 'customer') return '/customer/dashboard'
    return '#'
  }

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
            
            {/* Auth Section */}
            <div className="relative ml-4 profile-dropdown">
              {isAuthenticated && user ? (
                // Logged In - Show Profile Dropdown
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                      isScrolled
                        ? 'text-gray-800 bg-gray-100 border-gray-200 hover:bg-gray-200'
                        : 'text-white bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      isScrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                    }`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard size={18} />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>
                        
                        {user.role === 'customer' && (
                          <Link
                            href="/customer/bookings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Calendar size={18} />
                            <span className="text-sm font-medium">Booking Saya</span>
                          </Link>
                        )}
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Not Logged In - Show Login Button
                <Link href="/admin/login">
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                      isScrolled
                        ? 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                        : 'text-white bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    <User size={18} />
                    <span>Login</span>
                  </button>
                </Link>
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
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="px-6 py-3 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-300"
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  
                  {user.role === 'customer' && (
                    <Link
                      href="/customer/bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-300"
                    >
                      <Calendar size={20} />
                      <span>Booking Saya</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all duration-300"
                  >
                    <LogOut size={20} />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/admin/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2"
                >
                  <User size={20} />
                  <span>LOGIN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar