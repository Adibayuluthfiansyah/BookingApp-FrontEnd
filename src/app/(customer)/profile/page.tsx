"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomerLayout from "@/components/customer/CustomerLayout"; 
import { User, Mail, Calendar, Shield, Verified } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 
import { Skeleton } from "@/components/ui/skeleton";

// Loading Skeleton Component
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-lg border border-border">
        <Skeleton className="h-32 w-full" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
            <div className="flex-1 space-y-3 pb-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Halaman Profil Pengguna
export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <CustomerLayout>
        <div className="pt-6 md:pt-8 pb-8">
          <ProfileSkeleton />
        </div>
      </CustomerLayout>
    );
  }

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  // Get role badge variant
  const getRoleBadge = (role: string) => {
    const roles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      customer: { variant: "default", label: "Customer" },
      admin: { variant: "destructive", label: "Admin" },
      owner: { variant: "secondary", label: "Owner" },
    };
    return roles[role] || { variant: "outline", label: role };
  };

  const roleBadge = getRoleBadge(user.role);

  return (
    <CustomerLayout>
      <div className="space-y-6 pt-6 md:pt-8 pb-8">
        {/* Header dengan Gradient Background */}
        <div className="relative overflow-hidden rounded-xl border border-border shadow-lg">
          {/* Gradient Background */}
          <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                <Verified className="w-3 h-3 mr-1" />
                Terverifikasi
              </Badge>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background"></div>
              </div>

              {/* Name and Role */}
              <div className="flex-1 space-y-2 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <Badge variant={roleBadge.variant} className="w-fit capitalize flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {roleBadge.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Nama Lengkap Card */}
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                    Nama Lengkap
                  </Label>
                  <p className="text-base font-semibold text-foreground">
                    {user.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card */}
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                    Alamat Email
                  </Label>
                  <p className="text-base font-semibold text-foreground break-all">
                    {user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Card */}
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                    Role Pengguna
                  </Label>
                  <p className="text-base font-semibold text-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Since Card */}
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-medium tracking-wide">
                    Bergabung Sejak
                  </Label>
                  <p className="text-base font-semibold text-foreground">
                    {new Date().toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Details Card */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl">Detail Akun</CardTitle>
                <CardDescription>
                  Informasi lengkap profil Anda
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nama Lengkap Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={user.name}
                  readOnly
                  className="pl-9 bg-muted/50 cursor-default border-border"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="pl-9 bg-muted/50 cursor-default border-border"
                />
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Untuk mengubah informasi profil Anda, silakan hubungi administrator sistem atau tim dukungan pelanggan kami.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}