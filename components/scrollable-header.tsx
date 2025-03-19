"use client";

import { useEffect, useState } from "react";

export function ScrollableHeader({ title }: { title: string }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-md bg-gradient-to-r from-[#34d399] to-[#b8af4f] p-6 ${
        scrolled ? "bg-opacity-50 backdrop-blur-sm" : "bg-opacity-90"
      }`}
    >
      <div className="flex items-center">
        <h1 className="font-semibold text-2xl text-white">{title}</h1>
      </div>
    </div>
  );
}

export default ScrollableHeader; 