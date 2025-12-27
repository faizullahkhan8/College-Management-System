import React from 'react';
import Navbar from '../components/landing/navbar.landing.jsx';
import HeroSection from '../components/landing/landing.hero.jsx';
import KeyFeatures from '../components/landing/landing.features.jsx';
import RoleBenefits from '../components/landing/landing.benifits.jsx';
import Footer from '../components/landing/landing.footer.jsx';

function Landing() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <HeroSection />
        <KeyFeatures />
        <RoleBenefits />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
