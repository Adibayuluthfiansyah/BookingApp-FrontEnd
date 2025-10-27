import Link from 'next/link'
import { LogIn } from 'lucide-react'
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
    <div className="ml-4">
      {isAuthenticated && user ? (
        <ProfileDropdown user={user} isScrolled={isScrolled} />
      ) : (
        <Link href="/login">
          <button
            className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 border ${
              isScrolled
                ? 'text-white bg-black border-black hover:bg-gray-800'
                : 'text-black bg-white border-white hover:bg-gray-100'
            }`}
          >
            <LogIn size={16} />
            <span>Masuk</span>
          </button>
        </Link>
      )}
    </div>
  )
}