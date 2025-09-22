'use client';

import React from "react";
import Hero from "./hero/page";
import VenuesPage from "./(customer)/venues/page";



export default function Home() {
  return (
    <div>
      <Hero/>
      {/* <CustomerHomePage/> */}
      <VenuesPage/>
    </div>
  );
}
