'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, LayoutDashboard, Calendar, LogOut, MapPin } from 'lucide-react' // Import MapPin
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'sonner'

interface ProfileDropdownProps {
  user: any
  isScrolled: boolean
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // --- PERBAIKAN: Tambahkan class 'profile-dropdown' ke div luar ---
      if (!target.closest('.profile-dropdown')) {
        setIsOpen(false)
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
      setIsOpen(false)
    } catch (error) {
      toast.error('Logout gagal')
    }
  }

  const getDashboardLink = () => {
    // --- PERBAIKAN: Tambahkan 'super_admin' ---
    if (user?.role === 'admin' || user?.role === 'super_admin') return '/admin/dashboard'
    // --- AKHIR PERBAIKAN ---
    if (user?.role === 'customer') return '/dash-customer' // Arahkan customer ke dashboard mereka
    return '#'
  }

  return (
    <div className="relative profile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
              user.role === 'super_admin'
                ? 'bg-red-100 text-red-700'
                : user.role === 'admin' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {/*Super Admin*/}
              {user.role === 'super_admin' ? 'Super Admin' : user.role}
            </span>
          </div>
          
          <div className="py-2">
            <Link
              href={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            
            {/* --- TAMBAHAN: Link khusus Super Admin (Opsional) --- */}
            {user.role === 'super_admin' && (
              <Link
                href="/admin/venues" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MapPin size={18} />
                <span className="text-sm font-medium">Semua Venue</span>
              </Link>
            )}
            {/* --- AKHIR TAMBAHAN --- */}

            {user.role === 'customer' && (
              <Link
                href="/my-bookings"
                onClick={() => setIsOpen(false)}
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
  )
}