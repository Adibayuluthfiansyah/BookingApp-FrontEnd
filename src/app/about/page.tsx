"use client"
import React from 'react';
import Image from 'next/image';
import { Eye, Target } from 'lucide-react';
import Footer from '@/app/utilities/footer/page';

const AboutPage = () => {
  return (
    <>
      <div className='min-h-screen bg-background text-foreground pt-14'>
        {/* Hero Section */}
        <div className='relative h-80 md:h-96 overflow-hidden'>
          <div className='absolute inset-0'>
            <Image 
              src='/about1.jpg' 
              fill 
              alt="Tim bekerja sama di kantor modern" 
              className='object-cover w-full h-full'
              priority 
              onError={(e) => { e.currentTarget.src = `https://placehold.co/1920x400/0a0a0a/999999?text=Tentang+Kami`; }}
            />
          </div>
          <div className='absolute inset-0 bg-black/60'></div> 
          <div className='relative z-10 flex items-center justify-center h-full text-center text-white'>
            <div className='max-w-2xl px-4'>
              <h1 className='text-4xl md:text-6xl font-bold mb-4'>Tentang Kami</h1>
              <p className='text-lg md:text-xl text-gray-200'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum, recusandae?
              </p>
            </div>
          </div>
        </div>

        {/* Konten Utama (Who We Are, Visi, Misi) */}
        <div className='max-w-screen-xl mx-auto py-16 px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='order-2 md:order-1 relative aspect-[4/3] w-full'> 
              <Image 
                src='/about.jpg' 
                fill 
                alt="Lapangan futsal indoor yang terang" 
                className='rounded-lg shadow-lg object-cover'
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/650x580/0a0a0a/999999?text=BookingApp`; }}
              />
            </div>

            {/* Teks Konten */}
            <div className='order-1 md:order-2 space-y-8'>
              <div>
                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-6'>
                  Siapa Kami
                </h2>
                {/* Ganti Lorem Ipsum */}
                <p className='text-muted-foreground leading-relaxed mb-6'>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi distinctio molestias repudiandae, voluptates explicabo, quod ut consequuntur vero animi fugit voluptatibus, suscipit ducimus ad. Autem!
                </p>
              </div>

              {/* Visi */}
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 text-primary w-9 h-8 rounded-full flex items-center justify-center mt-1'>
                  <Eye className="w-6 h-6"/> 
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-foreground mb-2'>Visi Kami</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    Menjadi platform booking olahraga nomor satu yang menghubungkan komunitas 
                    dengan fasilitas olahraga secara instan dan tanpa hambatan.
                  </p>
                </div>
              </div>

              {/* Misi */}
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 text-primary w-9 h-8 rounded-full flex items-center justify-center mt-1'>
                  <Target className="w-6 h-6"/> 
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-foreground mb-2'>Misi Kami</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
                      <li>Menyediakan platform yang intuitif dan mudah digunakan.</li>
                      <li>Memberikan informasi fasilitas olahraga yang lengkap dan akurat.</li>
                      <li>Mendukung gaya hidup sehat melalui kemudahan akses olahraga.</li>
                  </ul>
                </div>
              </div>
            </div> 
          </div> 
        </div> 
        <Footer/>
      </div> 
    </>
  )
}

export default AboutPage;