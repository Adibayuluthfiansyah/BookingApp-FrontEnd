'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next/navigation'; 

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportType, setSportType] = useState('all');
  const router = useRouter(); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm) query.set('search', searchTerm);
    if (sportType !== 'all') query.set('category', sportType); 
    router.push(`/venues?${query.toString()}`);
  };

  return (
    <section className="relative h-screen overflow-hidden text-white flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg" 
          alt="Lapangan sepak bola"
          fill
          priority 
          className="object-cover object-center w-full h-full"
          onError={(e) => { e.currentTarget.src = `https://placehold.co/1920x1080/111827/ffffff?text=Hero+Image`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div> {/* Gradient overlay */}
      </div>

      {/* Konten Hero */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-bold text-4xl md:text-5xl lg:text-6xl capitalize mb-6 leading-tight shadow-text" 
        >
          Booking Lapangan Futsal & Mini Soccer Jadi Lebih Mudah
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl shadow-text" 
        >
          Temukan dan pesan lapangan favorit Anda secara online dalam hitungan menit.
        </motion.p>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama venue atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-black bg-white/90 focus:bg-white border-none focus:ring-2 focus:ring-primary" // Style input
            />
          </div>
          <Select value={sportType} onValueChange={setSportType}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 text-black bg-white/90 border-none focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Pilih Olahraga" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="all">Semua Olahraga</SelectItem>
              <SelectItem value="futsal">Futsal</SelectItem>
              <SelectItem value="minisoccer">Mini Soccer</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto h-10 cursor-pointer bg-primary hover:bg-primary/50 text-primary-foreground px-6" 
          >
            <Search className="h-5 w-5 mr-2 sm:hidden" /> Cari
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
