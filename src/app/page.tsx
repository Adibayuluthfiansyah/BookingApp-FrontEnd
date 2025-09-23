'use client';

import React from "react";
import Hero from "./hero/page";
import Footer from "./utilities/footer/page";
import VenuesCard from "@/components/VenuesCard";
import { MOCK_VENUES } from "@/lib/utils";

export default function Home() {
  return (
    <div>
      <Hero/>
      <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto py-16 px-6">
      {MOCK_VENUES.map((venue) => (
        <VenuesCard 
          key={venue.id}
          venue={venue} 
          viewMode="grid"
        />
      ))}
      </div>
      </div>
      <Footer/>
    </div>
  );
}
