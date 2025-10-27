'use client'
import Link from 'next/link'

interface NavLogoProps {
  isScrolled: boolean
}

export const NavLogo: React.FC<NavLogoProps> = ({ isScrolled }) => {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-all duration-300"
    >
      
      <div className="flex flex-col leading-none text-center">
        <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${
          isScrolled ? 'text-black' : 'text-white'
        }`}>
          O7ONG CORP
        </span>
        <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${
          isScrolled ? 'text-gray-500' : 'text-white/70'
        }`}>
          Booking System
        </span>
      </div>
    </Link>
  )
}