'use client';

import React from "react";
import VenueCard from "@/components/customer/VenueCard";
import { Venue } from "@/types";

const mockVenues: Venue[] = [
  {
    id: "1",
    name: "GOR Senayan Futsal",
    description: "Lapangan futsal standar internasional dengan fasilitas lengkap.",
    address: "Jl. Asia Afrika No. 1, Jakarta",
    image: "/images/venue1.jpg",
    price_per_hour: 200000,
    facilities: ["Parkir Luas", "Kantin", "Shower"],
    rating: 4.8,
    fields: [],
  },
  {
    id: "2",
    name: "Futsal Center Bandung",
    description: "Lapangan futsal indoor dengan rumput sintetis premium.",
    address: "Jl. Braga No. 20, Bandung",
    image: "/images/venue2.jpg",
    price_per_hour: 150000,
    facilities: ["Musholla", "Toilet", "Tempat Duduk"],
    rating: 4.6,
    fields: [],
  },
  {
    id: "3",
    name: "Lapangan Indoor Surabaya",
    description: "Cocok untuk pertandingan atau sekadar fun futsal bareng teman.",
    address: "Jl. Pemuda No. 15, Surabaya",
    image: "/images/venue3.jpg",
    price_per_hour: 180000,
    facilities: ["AC Indoor", "Locker", "Free WiFi", "Kantin"],
    rating: 4.7,
    fields: [],
  },
];

export default function Home() {
  return (
    <div className="pt-22 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Daftar Venue</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVenues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
