import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface NavLinksProps {
  items: NavItem[];
  pathname: string;
  isScrolled: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ items, pathname, isScrolled }) => {
  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md',
              isScrolled ? 'text-foreground/80 hover:text-foreground hover:bg-accent' : 'text-gray-200 hover:text-white hover:bg-white/10',
              isActive && (isScrolled ? 'text-primary font-semibold bg-primary/10' : 'text-white font-semibold bg-white/20'),
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
};