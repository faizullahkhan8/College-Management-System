import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
      w-[90%] md:w-[70%] 
      backdrop-blur-2xl bg-blue-400/30 border border-white/20
      shadow-[0_4px_30px_rgba(0,0,0,0.1)] 
      flex items-center justify-between 
      px-6 py-3 rounded-2xl transition-all duration-500 ease-in-out
      hover:shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
      
      
      <div className="font-bold text-xl tracking-wide text-blue-600 select-none">
        campusConnect
      </div>

      <div className="flex gap-3 items-center">
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full 
          font-medium shadow-md transition-all duration-300 ease-in-out
          hover:bg-blue-700 hover:scale-105 hover:shadow-lg active:scale-95">
          Login
        </button>
        <button className="bg-white/60 text-slate-800 px-6 py-2.5 rounded-full 
          font-medium backdrop-blur-sm border border-white/40 
          shadow-sm transition-all duration-300 ease-in-out
          hover:bg-white hover:scale-105 hover:shadow-md active:scale-95">
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
