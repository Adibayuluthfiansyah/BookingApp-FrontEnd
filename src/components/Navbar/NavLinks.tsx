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
    </>
  )
}