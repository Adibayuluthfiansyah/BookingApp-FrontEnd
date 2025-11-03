import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">O7ONG CORP</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Platform booking lapangan mini soccer dan futsal terpercaya di Indonesia. 
              Temukan lapangan terbaik dengan harga terjangkau.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <Instagram/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <Facebook/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <Twitter/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Lainnya</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Beranda</Link></li>
              <li><Link href="/venues" className="text-gray-300 hover:text-white transition-colors">Semua Venues</Link></li>
              <li><Link href="/booking" className="text-gray-300 hover:text-white transition-colors">Booking</Link></li>
              <li><Link href="/#" className="text-gray-300 hover:text-white transition-colors">Bantuan</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Hubungi Kami</Link></li>
              <li><Link href="/#" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/#" className="text-gray-300 hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/#" className="text-gray-300 hover:text-white transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © O7ONG CORP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}