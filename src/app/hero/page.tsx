'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="hero-image"
          fill
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative flex flex-col justify-center items-center h-full text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-bold text-5xl capitalize mb-10"
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates, hic!
          </motion.p>

          <motion.div
            className="flex gap-5 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/venues">
                <Button
                  size="lg"
                  className="w-full sm:w-auto cursor-pointer hover:bg-white hover:text-black transition"
                >
                  Cari Lapangan
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/about">
                <Button
                  size="lg"
                  className="w-full sm:w-auto border-1 text-white bg-transparent hover:bg-white hover:text-black hover:shadow-lg cursor-pointer transition"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
