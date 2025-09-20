'use client'

import React, { useState } from 'react'
import { MapPin, Clock, Users, Search, Grid3X3, List } from 'lucide-react'
import Image from 'next/image'
import { MOCK_VENUES } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'


const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp 150.000", min: 0, max: 150000 },
  { label: "Rp 150.000 - Rp 250.000", min: 150000, max: 250000 },
  { label: "> Rp 250.000", min: 250000, max: Infinity }
]

const VenueCard = ({ venue, viewMode, onVenueClick }) => {
  const isGrid = viewMode === 'grid'
  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${!isGrid && "flex"}`}
      onClick={() => onVenueClick(venue)}
    >
      {/* Image */}
      <div className={`relative ${isGrid ? "h-48 w-full" : "h-32 w-48 flex-shrink-0"}`}>
        <Image src={venue.image} alt={venue.name} fill className="object-cover" />
        {!venue.is_open && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">Tutup</div>}
        <div className="absolute bottom-3 right-3 bg-white/90 text-gray-900 text-xs px-2 py-1 rounded-lg">{venue.distance}</div>
      </div>

      {/* Content */}
      <div className={`p-4 ${!isGrid && "flex-1"}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{venue.name}</h3>
          <div className="text-right text-green-600 font-bold">
            {formatCurrency(venue.price_per_hour)}
            <div className="text-gray-500 text-xs">/ jam</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 text-red-500" />
          <span className="line-clamp-1">{venue.address}</span>
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{venue.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{venue.total_fields} lapangan</span>
          <span className={`flex items-center gap-1 ${venue.is_open ? "text-green-600" : "text-red-600"}`}>
            <Clock className="w-4 h-4" /> {venue.is_open ? "Buka" : "Tutup"}
          </span>
        </div>

        {/* Facilities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {venue.facilities.slice(0, 3).map((f, i) => (
            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">{f}</span>
          ))}
          {venue.facilities.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">+{venue.facilities.length - 3} lainnya</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0])
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('grid')
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
              onChange={(e) => setSelectedPriceRange(PRICE_RANGES.find(r => r.label === e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {PRICE_RANGES.map((r) => <option key={r.label}>{r.label}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showOpenOnly} onChange={(e) => setShowOpenOnly(e.target.checked)} className="w-4 h-4" />
              Hanya yang buka
            </label>
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
            {sortedVenues.map((v) => <VenueCard key={v.id} venue={v} viewMode={viewMode} onVenueClick={() => console.log("Detail:", v.id)} />)}
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
    </div>
  )
}
