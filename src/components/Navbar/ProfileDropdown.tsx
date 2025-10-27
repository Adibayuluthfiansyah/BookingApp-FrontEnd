"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  Calendar,
  ChevronDown 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Import cn utility

interface ProfileDropdownProps {
  user: any;
  isScrolled: boolean;
}

export function ProfileDropdown({ user, isScrolled }: ProfileDropdownProps) {
  const { logout } = useAuth();
  const router = useRouter(); 

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Gagal keluar");
    }
  };

  // Ambil inisial untuk fallback avatar
  const fallback = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={cn(
            "group flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg transition-all duration-300 border",
            isScrolled
              ? 'bg-white border-gray-200 hover:bg-gray-50'
              : 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20'
          )}
        >
          <Avatar className="h-7 w-7 border-2 border-current">
            <AvatarFallback 
              className={cn(
                "text-xs font-semibold",
                isScrolled ? 'bg-black text-white' : 'bg-white text-black'
              )}
            >
              {fallback}
            </AvatarFallback>
          </Avatar>
          
          <span className={cn(
            "text-sm font-medium hidden sm:block",
            isScrolled ? 'text-black' : 'text-white'
          )}>
            {/* Menampilkan hanya nama depan */}
            {user.name?.split(' ')[0]}
          </span>
          
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180",
              isScrolled ? 'text-gray-600' : 'text-white/80'
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <p className="font-semibold text-black truncate">{user.name}</p>
          <p className="text-xs text-gray-500 font-normal truncate">{user.email}</p>
          <span className={cn(
            "inline-block mt-1.5 px-2 py-0.5 text-[10px] font-medium rounded uppercase",
             user.role === 'admin' 
               ? 'bg-black text-white' 
               : 'bg-gray-200 text-gray-900'
          )}>
            {user.role}
          </span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {user.role === "admin" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        {user.role === "customer" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dash-customer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/my-bookings">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Booking Saya</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}