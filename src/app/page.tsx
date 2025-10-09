'use client';

import React from "react";
import { getAllVenues } from '@/lib/api'
import { Venue } from '@/types'
import Footer from "./utilities/footer/page";
import VenuesCard from "@/components/VenuesCard";
import { useState, useEffect } from "react";
import Hero from "./hero/page";

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getAllVenues()
      console.log('Homepage venues result:', result)

      if (result.success && result.data) {
        // Ambil 3 venue pertama untuk homepage
        setVenues(result.data.slice(0, 3))
      } else {
        setError(result.message || 'Gagal memuat data lapangan')
      }
    } catch (err) {
      console.error('Error loading venues:', err)
      setError('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Hero/>
    <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto py-16 px-6">
          {loading ? (
            // Loading state
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={loadVenues}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Coba Lagi
              </button>
            </div>
          ) : venues.length > 0 ? (
            // Venues loaded
            venues.map((venue) => (
              <VenuesCard
                key={venue.id}
                venue={venue}
                viewMode="grid"
              />
            ))
          ) : (
            // No venues
            <div className="col-span-full text-center py-12 text-gray-500">
              Belum ada lapangan tersedia
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
