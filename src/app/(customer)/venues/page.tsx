'use client';

import Link from "next/link";
import Image from "next/image";
import { MOCK_VENUES, formatCurrency } from "@/lib/utils";
import { Star, MapPin } from "lucide-react";

export default function VenuesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-24">
      <h1 className="text-3xl font-bold mb-8">Daftar Lapangan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VENUES.map((venue) => (
          <Link
            key={venue.id}
            href={`/venues/${venue.id}`}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Gambar venue */}
            <div className="relative h-48">
              <Image
                src={venue.image}
                alt={venue.name}
                width={400}
                height={400}
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {venue.rating}
              </div>
            </div>

            {/* Detail venue */}
            <div className="p-4">
              <h2 className="text-lg font-bold mb-1">{venue.name}</h2>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                {venue.address}
              </div>
              <div className="text-green-600 font-bold">
                {formatCurrency(venue.price_per_hour)}{" "}
                <span className="text-gray-500 font-normal">/ jam</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
