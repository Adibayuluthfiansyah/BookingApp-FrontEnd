'use client'
import Link from 'next/link'

interface NavLogoProps {
  isScrolled: boolean
}

export const NavLogo: React.FC<NavLogoProps> = ({ isScrolled }) => {
  return (
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
  )
}


