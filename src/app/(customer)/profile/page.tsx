"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 

// Komponen Skeleton untuk loading state
function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl py-10 ">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/3" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-2/3" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Halaman Profil Pengguna
export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Gagal memuat profil. Silakan coba login kembali.</p>
      </div>
    );
  }

  const fallback =
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || <User className="h-4 w-4" />;

  return (
    <div className="container mx-auto max-w-2xl py-10 mt-12">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Akun Saya</CardTitle>
          <CardDescription>
            Lihat dan kelola informasi profil Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bagian Avatar dan Nama */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border">
              {/* <AvatarImage src="/path-to-image.jpg" /> */}
              <AvatarFallback className="text-3xl">{fallback}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge
                variant="outline"
                className="mt-2 capitalize"
              >
                {user.role}
              </Badge>
            </div>
          </div>

          {/* Bagian Form (Read-Only) */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={user.name}
                  readOnly
                  className="pl-9 bg-muted/50 cursor-default"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="pl-9 bg-muted/50 cursor-default"
                />
              </div>
            </div>
          </div>
          
          {/* CATATAN: 
            Di masa depan, Anda bisa menambahkan <Button>Edit Profile</Button> 
            yang akan mengubah state untuk memperbolehkan input di-edit 
            dan mengirimkan update ke API.
          */}
        </CardContent>
      </Card>
    </div>
  );
}