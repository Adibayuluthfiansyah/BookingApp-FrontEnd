'use client'

import React, { useState } from 'react'
import { Search, Grid3X3, List } from 'lucide-react'
import Image from 'next/image'
import { MOCK_VENUES } from '@/lib/utils'
import Footer from '@/app/utilities/footer/page'
import VenuesCard from '@/components/VenuesCard'

const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp 150.000", min: 0, max: 150000 },
  { label: "Rp 150.000 - Rp 250.000", min: 150000, max: 250000 },
  { label: "> Rp 250.000", min: 250000, max: Infinity }
]

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0])
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOpenOnly, setShowOpenOnly] = useState(false)

  // Filter venues
  const filteredVenues = MOCK_VENUES.filter((v) => {
    const matchesSearch = [v.name, v.address, v.description].some((txt) =>
      txt.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesPrice = v.price_per_hour >= selectedPriceRange.min && v.price_per_hour <= selectedPriceRange.max
    const matchesOpen = !showOpenOnly || v.is_open
    return matchesSearch && matchesPrice && matchesOpen
  })


  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case 'price': return a.price_per_hour - b.price_per_hour
      case 'name': return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedPriceRange(PRICE_RANGES[0])
    setShowOpenOnly(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
        <div className=' relative h-80 md:h-96 overflow-hidden'>
              <div className='absolute inset-0'>
                  <Image src='/lapanganpage.jpg' width={650} height={579} alt="about image"
                  className='object-cover w-full h-full'/>
              </div>
            <div className='absolute inset-0 bg-black/50'></div>
            <div className='relative z-10 flex items-center justify-center h-full text-center text-white'>
            <div>
                <h1 className='text-4xl md:text-6xl font-bold mb-4'>Cari Lapangan</h1>
                <p className='text-lg md:text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, aliquid!</p>
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
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {PRICE_RANGES.map((r) => <option key={r.label}>{r.label}</option>)}
            </select>
            <button onClick={clearAllFilters} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Reset Filter</button>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
              <option value="price">Harga Terendah</option>
              <option value="name">Nama A-Z</option>
            </select>
            <div className="flex border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Venues Grid/List */}
        {sortedVenues.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {sortedVenues.map((v) => <VenuesCard key={v.id} venue={v} viewMode={viewMode} onVenueClick={() => console.log("Detail:", v.id)} />)}
          </div>
        ) : (
          <div className="text-center py-12 ">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4 " />
            <h3 className="text-xl font-semibold mb-2">Tidak ada lapangan ditemukan</h3>
            <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian.</p>
            <button onClick={clearAllFilters} className="bg-blue-500 text-white px-6 py-2 rounded-lg ">Reset Semua Filter</button>
          </div>
        )}
      </main>
      <Footer/>
    </div>
  )
}
