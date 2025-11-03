'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { createVenue } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Skema validasi Zod
const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama venue minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  address: z.string().min(5, { message: 'Alamat wajib diisi' }),
  city: z.string().min(3, { message: 'Kota wajib diisi' }),
  province: z.string().min(3, { message: 'Provinsi wajib diisi' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),
  image_url: z.string().url({ message: 'URL gambar tidak valid' }).min(1, { message: 'URL Gambar wajib diisi' }),
  facebook_url: z.string().url({ message: 'URL Facebook tidak valid' }).optional().or(z.literal('')),
  instagram_url: z.string().url({ message: 'URL Instagram tidak valid' }).optional().or(z.literal('')),
});

type VenueFormValues = z.infer<typeof formSchema>;

export default function CreateVenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      province: '',
      phone: '',
      email: '',
      image_url: '',
      facebook_url: '',
      instagram_url: '',
    },
  });

  const onSubmit = async (data: VenueFormValues) => {
    setLoading(true);
    try {
      const result = await createVenue(data);

      if (result.success) {
        toast.success('Venue baru berhasil dibuat!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/venues');
      } else {
        const description = result.errors
          ? Object.values(result.errors).flat().join(', ')
          : result.message || 'Silakan cek kembali data Anda.';
        toast.error('Gagal membuat venue', { description });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('Terjadi Kesalahan', {
          description: error.message || 'Tidak dapat terhubung ke server.',
        });
      } else {
        toast.error('Terjadi Kesalahan', {
          description: 'Tidak dapat terhubung ke server.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-6">
        <Button type="button" variant="outline" size="icon" onClick={() => router.push('/admin/venues')} className="h-9 w-9">
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Kembali</span>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tambah Venue Baru</h1>
          <p className="text-muted-foreground text-sm">Isi detail untuk mendaftarkan venue baru Anda.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Form Kiri (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Informasi Utama</CardTitle>
                  <CardDescription>Detail dasar, alamat, dan kontak.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nama Venue */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Venue <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: GOR Senayan Futsal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deskripsi */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Deskripsi singkat tentang fasilitas, jenis lapangan, dll."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Alamat */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Lengkap <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Jl. Asia Afrika No. 8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Kota & Provinsi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kota <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Jakarta Pusat" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provinsi <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="DKI Jakarta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Kontak & Media</CardTitle>
                    <CardDescription>URL untuk gambar utama dan media sosial.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Telepon & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telepon Venue (Opsional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Venue (Opsional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="info@venue.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL Gambar Utama <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                            <Input type="url" placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>Gunakan link gambar publik (misal dari Unsplash, Imgur).</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="instagram_url"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instagram URL (Opsional)</FormLabel>
                                <FormControl>
                                <Input type="url" placeholder="https://instagram.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="facebook_url"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Facebook URL (Opsional)</FormLabel>
                                <FormControl>
                                <Input type="url" placeholder="https://facebook.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Kolom Aksi Kanan (1/3) */}
            <div className="lg:col-span-1">
               <Card className="border-border shadow-sm sticky top-24"> {/* Dibuat sticky */}
                 <CardHeader>
                   <CardTitle>Aksi</CardTitle>
                 </CardHeader>
                 <CardFooter className="flex flex-col gap-3">
                   <Button type="submit" disabled={loading} className="w-full">
                     {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {loading ? 'Menyimpan...' : 'Simpan Venue'}
                   </Button>
                   <Button type="button" variant="outline" onClick={() => router.push('/admin/venues')} className="w-full">
                     Batal
                   </Button>
                 </CardFooter>
               </Card>
            </div>
          </div>
        </form>
      </Form>
    </AdminLayout>
  );
}