'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Hero() {

  return (
      <section className="relative h-screen overflow-hidden text-white">
        <div className='absolute inset-0'>
          <Image src="/hero.jpg" alt="hero-image" fill className="object-cover object-center w-full h-full"/>
          <div className='absolute inset-0 bg-black opacity-50'></div>
          <div className='relative flex flex-col justify-center items-center h-full text-center'>
            <h1 className='font-bold text-5xl capitalize mb-10'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, officia.</h1>
            <div className='flex gap-5'>
            <Link href="/homepage-cus">
                <Button size="lg" className="w-full sm:w-auto cursor-pointer hover:bg-white hover:text-black">
                    Cari Lapangan
                </Button>
            </Link>
            <Link href="/CustomerHomePage">
                <Button  size="lg" className="w-full sm:w-auto border-1 text-white bg-transparent hover:bg-white hover:text-black hover:shadow-lg cursor-pointer">
                    Pelajari Lebih Lanjut
                </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>
  );
}
 
