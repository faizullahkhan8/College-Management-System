import React from 'react';
import Hero from '../../assets/hero.jpg'

const HeroSection = () => {
  return (
    <section className="relative mt-24 flex flex-col items-center justify-center text-center px-6 md:px-10">
      
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl shadow-lg group">
        <img
          src={Hero}
          alt="Campus"
          className="w-full h-[400px] md:h-[550px] object-cover rounded-3xl transform transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:brightness-90"
        />
       
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-3xl md:text-7xl mt-16 font-extrabold leading-tight drop-shadow-md">
            Streamline Your Campus with
            <span className="block text-blue-400">campusConnect</span>
          </h1>
          <p className="mt-8 text-sm md:text-lg font-medium text-gray-200 max-w-2xl mx-auto">
            A Comprehensive College Management System designed to enhance Efficiency and Communication across your Institution.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
              Admin
            </button>
            <button className="bg-white/90 text-slate-800 hover:bg-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
              Faculty
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105">
              Student
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;