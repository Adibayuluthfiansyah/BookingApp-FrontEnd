import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, LogOut, User } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { toast } from 'sonner'

interface NavItem {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  navItems: NavItem[]
  pathname: string
  isAuthenticated: boolean
  user: any
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navItems,
  pathname,
  isAuthenticated,
  user,
  onClose,
}) => {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Berhasil keluar')
      router.push('/')
      onClose()
    } catch (error) {
      toast.error('Gagal keluar')
    }
  }

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard'
    if (user?.role === 'customer') return '/dash-customer'
    return '#'
  }

  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out ${
      isOpen 
        ? 'max-h-screen opacity-100' 
        : 'max-h-0 opacity-0'
    } overflow-hidden`}>
      <div className="bg-white border-t border-gray-200">
        <div className="px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                pathname === item.href
                  ? 'text-white bg-black'
                  : 'text-gray-700 hover:text-black hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-gray-200 space-y-1">
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                  <p className="text-sm font-semibold text-black">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded uppercase ${
                    user.role === 'admin' 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <Link
                  href={getDashboardLink()}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  href="/my-bookings"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
                >
                  <Calendar size={18} />
                  <span>Booking Saya</span>
                </Link>
                
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200"
                >
                  <User size={18} />
                  <span>Profil</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all duration-200"
              >
                <User size={18} />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}