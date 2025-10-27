import Link from 'next/link'
import { cn } from '@/lib/utils' 

interface NavItem {
  label: string
  href: string
}

interface NavLinksProps {
  items: NavItem[]
  pathname: string
  isScrolled: boolean
}

export const NavLinks: React.FC<NavLinksProps> = ({ items, pathname, isScrolled }) => {
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg',
            {
              'text-white bg-black': pathname === item.href && isScrolled,
              'text-black bg-white': pathname === item.href && !isScrolled,
              'text-gray-700 hover:text-black hover:bg-gray-100':
                pathname !== item.href && isScrolled,
              'text-white/90 hover:text-white hover:bg-white/10':
                pathname !== item.href && !isScrolled,
            }
          )}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
