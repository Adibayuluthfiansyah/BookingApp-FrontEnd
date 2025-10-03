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
      toast.success('Logout berhasil')
      router.push('/')
      onClose()
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
    <div className={`md:hidden transition-all duration-500 ease-in-out ${
      isOpen 
        ? 'max-h-screen opacity-100' 
        : 'max-h-0 opacity-0'
    } overflow-hidden`}>
      <div className="bg-white/98 backdrop-blur-xl shadow-2xl border-t border-black/5">
        <div className="px-6 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2 ${
                pathname === item.href
                  ? 'text-white bg-black shadow-lg shadow-black/10'
                  : 'text-gray-700 hover:text-black hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          
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
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-all duration-300"
                >
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                
                {user.role === 'customer' && (
                  <Link
                    href="/customer/bookings"
                    onClick={onClose}
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
                href="/login"
                onClick={onClose}
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
  )
}