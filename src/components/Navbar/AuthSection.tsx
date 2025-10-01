import Link from 'next/link'
import { User } from 'lucide-react'
import { ProfileDropdown } from './ProfileDropdown'

interface AuthSectionProps {
  isScrolled: boolean
  isAuthenticated: boolean
  user: any
}

export const AuthSection: React.FC<AuthSectionProps> = ({ 
  isScrolled, 
  isAuthenticated, 
  user 
}) => {
  return (
    <div className="relative ml-4 profile-dropdown">
      {isAuthenticated && user ? (
        <ProfileDropdown user={user} isScrolled={isScrolled} />
      ) : (
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
  )
}