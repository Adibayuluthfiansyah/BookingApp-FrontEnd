'use client';
import Link from 'next/link';
import { MapPin} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function CustomerHomePage() {
  const [currentView, setCurrentView] = useState('venues');
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // Mock data venues
  const venues = [
    {
      id: "1",
      name: 'GOR Pangsuma',
      address: 'Pontianak',
      price_per_hour: 200000,
      type: 'Futsal',
      image: '/pangsuma.jpg',
      facilities: ['Parkir', 'Kantin', 'Toilet', 'Shower'],
      description: 'Lapangan futsal modern dengan fasilitas lengkap',
      fields: []
    },
    {
      id: "2",
      name: 'Gladiator Futsal',
      address: 'Pontianak',
      price_per_hour: 150000,
      type: 'Futsal',
      image: '/gladiator.jpg',
      facilities: ['Parkir', 'Kantin'],
      description: 'Lapangan futsal dengan fasilitas modern',
      fields: []
    },
    {
      id: "3",
      name: 'JS Mini Soccer',
      address: 'Pontianak',
      price_per_hour: 600000,
      type: 'Mini Soccer',
      image: '/jsminso.jpg',
      facilities: ['Parkir', 'Kantin', 'Toilet'],
      description: 'Lapangan mini soccer indoor yang nyaman',
      fields: []
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const VenueCard = ({ venue }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={venue.image}
          alt={venue.name}
          width={500}     
          height={300}    
          className="w-full h-full object-cover"
        />

      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{venue.address}</span>
          <span className="mx-2">•</span>
          <span>{venue.type}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(venue.price_per_hour)}
            </span>
            <span className="text-gray-600 ml-1">/ jam</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {venue.facilities.map((facility, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {facility}
            </span>
          ))}
        </div>
        <button 
          className="w-full bg-black hover:-translate-y-0.5 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg  transition-all duration-300 transform"
          onClick={() => {
            <Link href={`/venues/${venue.id}`}></Link>
          }}
        >
          Lihat Selengkapnya
        </button>
      </div>
    </div>
  );

  const VenuesList = () => (
    <div className="pt-22 py-15 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Lapangan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {currentView === 'venues' && <VenuesList />}
      {currentView === 'lapangan' && (
        <LapanganPage 
          venueId={selectedVenueId}
          onBack={() => setCurrentView('venues')}
        />
      )}
    </div>
  );
} 