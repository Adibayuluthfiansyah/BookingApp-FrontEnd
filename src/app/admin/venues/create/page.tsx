'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from '@/components/ui/form';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { createVenue } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const MAX_MB = 2;
const MAX_UPLOAD_SIZE = 1024 * 1024 * MAX_MB;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama venue minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  address: z.string().min(5, { message: 'Alamat wajib diisi' }),
  city: z.string().min(3, { message: 'Kota wajib diisi' }),
  province: z.string().min(3, { message: 'Provinsi wajib diisi' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Email tidak valid' }).optional().or(z.literal('')),

  image_file: z
    .any()
    .refine((files) => files?.length == 1, 'Gambar utama wajib diunggah.')
    .refine(
      (files) => files?.[0]?.size <= MAX_UPLOAD_SIZE,
      `Ukuran gambar maks ${MAX_MB}MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Format gambar harus .jpg, .jpeg, .png, atau .webp',
    ),

  facebook_url: z
    .string()
    .url({ message: 'URL Facebook tidak valid' })
    .optional()
    .or(z.literal('')),
  instagram_url: z
    .string()
    .url({ message: 'URL Instagram tidak valid' })
    .optional()
    .or(z.literal('')),
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
      facebook_url: '',
      instagram_url: '',
    },
  });


  const fileRef = form.register('image_file');

  const onSubmit = async (data: VenueFormValues) => {
    setLoading(true);

    const formData = new FormData();

    formData.append('main_image', data.image_file[0]);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('province', data.province);

    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.facebook_url) formData.append('facebook_url', data.facebook_url);
    if (data.instagram_url) formData.append('instagram_url', data.instagram_url);

    try {
      const result = await createVenue(formData);

      if (result.success) {
        toast.success('Venue baru berhasil dibuat!', {
          icon: <CheckCircle className="w-5 h-5" />,
        });
        router.push('/admin/venues');
      } else {
        const description = result.errors
          ? Object.values(result.errors).flat().join(', ')
          : result.message || 'Silakan cek kembali data Anda.';

        if (result.errors) {
          const imageFileError = (result.errors as Record<string, string[]>)
            .image_file?.[0];

          if (imageFileError) {
            toast.error('Gagal membuat venue', {
              description: imageFileError,
            });
          } else {
            const allErrors = Object.values(result.errors).flat().join(', ');
            toast.error('Gagal membuat venue', {
              description: allErrors || description,
            });
          }
        } else {
          toast.error('Gagal membuat venue', { description });
        }
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
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.push('/admin/venues')}
          className="h-9 w-9"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="sr-only">Kembali</span>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Tambah Venue Baru
          </h1>
          <p className="text-muted-foreground text-sm">
            Isi detail untuk mendaftarkan venue baru Anda.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Informasi Utama</CardTitle>
                  <CardDescription>
                    Detail dasar, alamat, dan kontak.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nama Venue <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: GOR Senayan Futsal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Deskripsi <span className="text-destructive">*</span>
                        </FormLabel>
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
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Alamat Lengkap{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Jl. Asia Afrika No. 8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Kota <span className="text-destructive">*</span>
                          </FormLabel>
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
                          <FormLabel>
                            Provinsi <span className="text-destructive">*</span>
                          </FormLabel>
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
                  <CardDescription>
                    Upload gambar utama dan media sosial.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telepon Venue (Opsional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="08xxxxxxxxxx"
                              {...field}
                            />
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
                            <Input
                              type="email"
                              placeholder="info@venue.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* --- Field Input File --- */}
                  <FormItem>
                    <FormLabel>
                      Gambar Utama <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        name={fileRef.name}
                        ref={fileRef.ref}
                        onChange={fileRef.onChange}
                        onBlur={fileRef.onBlur}
                        className='bg-accent'
                      />
                    </FormControl>
                    <FormDescription>
                      File .jpg, .png, atau .webp. Maks 2MB.
                    </FormDescription>
                    {/* Tampilkan error secara manual */}
                    <FormMessage>
                      {form.formState.errors.image_file?.message as React.ReactNode}
                    </FormMessage>
                  </FormItem>
                  {/* --- Akhir Field Input File --- */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="instagram_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram URL (Opsional)</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://instagram.com/..."
                              {...field}
                            />
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
                            <Input
                              type="url"
                              placeholder="https://facebook.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-border shadow-sm sticky top-24">
                <CardHeader>
                  <CardTitle>Aksi</CardTitle>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {loading ? 'Menyimpan...' : 'Simpan Venue'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/venues')}
                    className="w-full"
                  >
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