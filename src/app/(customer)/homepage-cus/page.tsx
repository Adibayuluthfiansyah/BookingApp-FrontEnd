'use client';

import { Clock, MapPin, Users, Star} from 'lucide-react';
import { useState } from 'react';

export default function CustomerHomePage() {
  const [currentView, setCurrentView] = useState('venues');
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // Mock data venues
  const venues = [
    {
      id: "1",
      name: 'GOR Senayan Futsal',
      address: 'Jakarta',
      price_per_hour: 200000,
      type: 'Futsal',
      size: 'P 40 x L 32',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
      rating: 4.8,
      facilities: ['Parkir', 'Kantin', 'Toilet', 'Shower'],
      description: 'Lapangan futsal modern dengan fasilitas lengkap',
      fields: []
    },
    {
      id: "2",
      name: 'Futsal Center Bandung',
      address: 'Bandung',
      price_per_hour: 150000,
      type: 'Futsal',
      size: 'P 45 x L 30',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
      rating: 4.6,
      facilities: ['Parkir', 'Kantin', 'AC'],
      description: 'Lapangan futsal dengan AC dan fasilitas modern',
      fields: []
    },
    {
      id: "3",
      name: 'Lapangan Indoor Surabaya',
      address: 'Surabaya',
      price_per_hour: 180000,
      type: 'Mini Soccer',
      size: 'P 50 x L 30',
      image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=500',
      rating: 4.7,
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-48 bg-gray-200">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{venue.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{venue.address}</span>
          <span className="mx-2">•</span>
          <span>{venue.type}</span>
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Users className="w-4 h-4 mr-1" />
          <span>{venue.size}</span>
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
          className="w-full bg-black hover:bg-white hover:text-black cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          onClick={() => {
            setSelectedVenueId(venue.id);
            setCurrentView('lapangan');
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