'use client'
import React from 'react'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Venue } from '@/types'

interface VenuesCardProps {
  venue: Venue;
  viewMode?: 'grid' | 'list';
}

const VenuesCard: React.FC<VenuesCardProps> = ({ venue, viewMode = 'grid' }) => {
  const router = useRouter()
  const isGrid = viewMode === 'grid'
  
  const handleClick = () => {
    router.push(`/venues/${venue.id}`)
  }

  // Format currency
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  }

  // Get minimum price dari fields
  const getMinPrice = () => {
    // Debug log
    // console.log('Venue:', venue.name);
    // console.log('Fields:', venue.fields);
    
    if (!venue.fields || venue.fields.length === 0) {
      // console.log('No fields found');
      return 0;
    }
    
    let minPrice = Infinity;
    
    venue.fields.forEach(field => {
      // console.log('Field:', field.name, 'Time slots:', field.time_slots);
      
      // --- PERBAIKAN: Hapus duplikasi 'field.time_slots' ---
      const slots = field.time_slots || [];
      // --- AKHIR PERBAIKAN ---
      
      if (slots && slots.length > 0) {
        slots.forEach(slot => {
          // --- PERBAIKAN: Konversi harga ke Angka dan cek validitasnya ---
          const price = Number(slot.price);
          if (!isNaN(price) && price < minPrice) {
            minPrice = price;
          }
          // --- AKHIR PERBAIKAN ---
        });
      }
    });
    
    const finalPrice = minPrice === Infinity ? 0 : minPrice;
    // console.log('Min price for', venue.name, ':', finalPrice);
    
    return finalPrice;
  }

  const minPrice = getMinPrice();

  // Get image URL dengan fallback
  const getImageUrl = () => {
    // Prioritas: image_url -> images[0] -> default
    if (venue.image_url) return venue.image_url;
    if (venue.images && venue.images.length > 0 && venue.images[0].image_url) {
      return venue.images[0].image_url;
    }
    return '/lapanganpage.jpg';
  }

  const imageUrl = getImageUrl();

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
        !isGrid && "flex"
      }`}
      onClick={handleClick}
    >
      {/* Image */}
      <div className={`relative ${isGrid ? "h-48 w-full" : "h-32 w-48 flex-shrink-0"}`}>
        <Image 
          src={imageUrl} 
          alt={venue.name} 
          fill 
          sizes={isGrid ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : "192px"}
          className="object-cover" 
          priority={false}
        />
      </div>

      {/* Content */}
      <div className={`p-4 ${!isGrid && "flex-1"}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{venue.name}</h3>
          <div className="text-right text-green-600 font-bold ml-2 flex-shrink-0">
            {minPrice > 0 ? formatCurrency(minPrice) : 'Hubungi'}
            {minPrice > 0 && <div className="text-gray-500 text-xs">/ jam</div>}
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 text-red-500 flex-shrink-0" />
          <span className="line-clamp-1">{venue.address}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{venue.description}</p>
        
        {/* Facilities - Support both facilities array structure */}
        {venue.facilities && venue.facilities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {venue.facilities.slice(0, 3).map((facility, index) => (
              <span 
                key={facility.id || `facility-${index}`}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                {facility.name}
              </span>
            ))}
            {venue.facilities.length > 3 && (
              <span 
                key="facility-more"
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                +{venue.facilities.length - 3} lainnya
              </span>
            )}
          </div>
        )}

        {/* Fields Count */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {venue.fields ? venue.fields.length : 0} lapangan tersedia
          </span>
          <span className="text-orange-500 font-medium hover:text-orange-600">
            Lihat Detail
          </span>
        </div>
      </div>
    </div>
  )
}

export default VenuesCard