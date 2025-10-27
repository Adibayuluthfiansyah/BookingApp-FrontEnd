"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomerLayout from "@/components/customer/CustomerLayout"; 
import { User, Mail } from "lucide-react"; 
import { Badge } from "@/components/ui/badge"; 


// Halaman Profil Pengguna
export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) {
    // Tampilkan UI loading minimal selagi layout bekerja
    return <CustomerLayout>{null}</CustomerLayout>;
  }

  const fallback =
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || <User className="h-4 w-4" />;

  return (

    <CustomerLayout>
      <div className="pt-10">
      <Card className="border-border pt-10">
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
    </CustomerLayout>
  );
}

