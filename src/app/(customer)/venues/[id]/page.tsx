'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Venue } from "@/types";

export default function VenueDetailPage() {
  const params = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetch(`http://localhost:8000/api/venues/${params.id}`)
        .then((res) => res.json())
        .then((data) => setVenue(data));
    }
  }, [params?.id]);

  if (!venue) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10">
      {/* Banner */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info Venue */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        <p className="text-red-600 font-semibold">{venue.type} di {venue.address}</p>
        <div className="flex items-center text-gray-600 mt-2">
          <MapPin className="w-5 h-5 mr-2" />
          <span>{venue.address}</span>
        </div>
        <p className="mt-4 text-gray-700">{venue.description}</p>
      </div>

      {/* Facilities */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Fasilitas</h2>
        <div className="flex flex-wrap gap-2">
          {venue.facilities.map((f, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Field</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venue.fields.map((field) => (
            <div
              key={field.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-40">
                <Image
                  src={field.image}
                  alt={field.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{field.name}</h3>
                <p className="text-red-600 font-bold">
                  Rp {field.price.toLocaleString("id-ID")}
                </p>
                <button className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                  Lihat Jadwal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
