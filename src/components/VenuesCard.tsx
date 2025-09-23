'use client'
import React from 'react'
import { formatCurrency } from '@/lib/utils'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { VenuesCardProps } from '@/types'

const VenuesCard: React.FC<VenuesCardProps> = ({ venue, viewMode }) => {
  const router = useRouter()
  const isGrid = viewMode === 'grid'
  
  const handleClick = () => {
    router.push(`/venues/${venue.id}`)
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${!isGrid && "flex"}`}
      onClick={handleClick}
    >
      {/* Image */}
      <div className={`relative ${isGrid ? "h-48 w-full" : "h-32 w-48 flex-shrink-0"}`}>
        <Image src={venue.image} alt={venue.name} fill className="object-cover" />
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
        
        {/* Facilities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {venue.facilities.slice(0, 3).map((f, i) => (
            <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">{f}</span>
          ))}
          {venue.facilities.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">+{venue.facilities.length - 3} lainnya</span>
          )}
        </div>

        {/* Fields Count */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{venue.fields.length} lapangan tersedia</span>
          <span className="text-orange-500 font-medium hover:text-orange-600">
            Lihat Detail →
          </span>
        </div>
      </div>
    </div>
  )
}

export default VenuesCard