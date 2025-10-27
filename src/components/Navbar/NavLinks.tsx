import Link from 'next/link'

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
          className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
            pathname === item.href
              ? isScrolled
                ? 'text-white bg-black'
                : 'text-black bg-white'
              : isScrolled
              ? 'text-gray-700 hover:text-black hover:bg-gray-100'
              : 'text-white/90 hover:text-white hover:bg-white/10'
          }`}
        >
          {item.label}
          {pathname === item.href && (
            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
              isScrolled ? 'bg-white' : 'bg-black'
            }`} />
          )}
        </Link>
      ))}
    </>
  )
}