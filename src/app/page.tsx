'use client';

import React from "react";
import Footer from "./utilities/footer/page";
import Hero from "./hero/page";
import CustomerHomePage from "./(customer)/homepage-cus/page";
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
