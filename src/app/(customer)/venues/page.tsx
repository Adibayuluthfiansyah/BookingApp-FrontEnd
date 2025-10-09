'use client'

import React, { useState, useEffect } from 'react'
import { Search, Grid3X3, List } from 'lucide-react'
import Image from 'next/image'
import Footer from '@/app/utilities/footer/page'
import VenuesCard from '@/components/VenuesCard'
import { getAllVenues } from '@/lib/api'
import { Venue } from '@/types'

const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp 150.000", min: 0, max: 150000 },
  { label: "Rp 150.000 - Rp 250.000", min: 150000, max: 250000 },
  { label: "> Rp 250.000", min: 250000, max: Infinity }
]

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0])
  const [sortBy, setSortBy] = useState('price')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadVenues()
  }, [])

  const loadVenues = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching venues...')
      const result = await getAllVenues()
      console.log('Venues result:', result)

      if (result.success && result.data) {
        setVenues(result.data)
        console.log('Venues loaded:', result.data.length)
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

  // Get minimum price from venue's time slots
  const getMinPrice = (venue: Venue) => {
    if (!venue.fields || venue.fields.length === 0) return 0
    
    let minPrice = Infinity
    venue.fields.forEach(field => {
      if (field.time_slots && field.time_slots.length > 0) {
        field.time_slots.forEach(slot => {
          if (slot.price < minPrice) {
            minPrice = slot.price
          }
        })
      }
    })
    
    return minPrice === Infinity ? 0 : minPrice
  }

  // Filter venues
  const filteredVenues = venues.filter((v) => {
    const matchesSearch = [v.name, v.address, v.description || ''].some((txt) =>
      txt?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const venueMinPrice = getMinPrice(v)
    const matchesPrice = venueMinPrice >= selectedPriceRange.min && venueMinPrice <= selectedPriceRange.max
    return matchesSearch && matchesPrice
  })

  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case 'price': 
        return getMinPrice(a) - getMinPrice(b)
      case 'name': 
        return a.name.localeCompare(b.name)
      default: 
        return 0
    }
  })

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedPriceRange(PRICE_RANGES[0])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Memuat data lapangan...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-xl text-red-500 mb-4">{error}</div>
        <button 
          onClick={loadVenues}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className='relative h-80 md:h-96 overflow-hidden'>
        <div className='absolute inset-0'>
          <Image 
            src='/lapanganpage.jpg' 
            width={1920} 
            height={1080} 
            alt="Lapangan background"
            className='object-cover w-full h-full'
            priority
          />
        </div>
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 flex items-center justify-center h-full text-center text-white'>
          <div>
            <h1 className='text-4xl md:text-6xl font-bold mb-4'>Cari Lapangan</h1>
            <p className='text-lg md:text-xl'>Temukan lapangan futsal dan mini soccer terbaik di sekitar Anda</p>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Lapangan</h1>
            <p className="text-gray-600">Temukan lapangan minisoccer atau futsal</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari lapangan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <select
              value={selectedPriceRange.label}
              onChange={(e) => setSelectedPriceRange(PRICE_RANGES.find(r => r.label === e.target.value) ?? PRICE_RANGES[0])}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              {PRICE_RANGES.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>
            <button 
              onClick={clearAllFilters} 
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="price">Harga Terendah</option>
              <option value="name">Nama A-Z</option>
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {sortedVenues.length} lapangan
            {searchQuery && <span> untuk {searchQuery}</span>}
          </p>
        </div>

        {/* Venues Grid/List */}
        {sortedVenues.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {sortedVenues.map((venue) => (
              <VenuesCard 
                key={`venue-${venue.id}`}
                venue={venue} 
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada lapangan ditemukan</h3>
            <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian.</p>
            <button 
              onClick={clearAllFilters} 
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </main>
      
      <Footer/>
    </div>
  )
}