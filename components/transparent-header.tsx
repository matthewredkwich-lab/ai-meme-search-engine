"use client";

import { useEffect } from "react";

export default function TransparentHeader() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (!header) return;
      
      // Create or find the logo element
      let logoElement = document.getElementById('header-upstash-logo') as HTMLImageElement | null;
      
      if (window.scrollY > 100) {
        // Make more transparent when scrolled
        header.style.background = 'linear-gradient(to right, rgba(52, 211, 153, 0.3), rgba(184, 175, 79, 0.3))';
        header.style.backdropFilter = 'blur(8px)';
        
        // Add the logo if it doesn't exist yet
        if (!logoElement) {
          logoElement = document.createElement('img');
          logoElement.id = 'header-upstash-logo';
          logoElement.src = '/upstash-logo.svg';
          logoElement.alt = 'Upstash Logo';
          logoElement.style.position = 'absolute';
          logoElement.style.right = '20px';
          logoElement.style.top = '50%';
          logoElement.style.transform = 'translateY(-50%)';
          logoElement.style.width = '30px';
          logoElement.style.height = '30px';
          logoElement.style.opacity = '0';
          logoElement.style.transition = 'opacity 0.3s ease';
          header.appendChild(logoElement);
          
          // Trigger a reflow before setting the opacity
          setTimeout(() => {
            if (logoElement) logoElement.style.opacity = '1';
          }, 10);
        } else {
          logoElement.style.opacity = '1';
        }
      } else {
        // More solid when at top
        header.style.background = 'linear-gradient(to right, rgba(52, 211, 153, 0.9), rgba(184, 175, 79, 0.9))';
        header.style.backdropFilter = 'none';
        
        // Hide the logo when at the top
        if (logoElement) {
          logoElement.style.opacity = '0';
        }
      }
    };
    
    // Run once on load
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up by removing the logo if it exists
      const logoElement = document.getElementById('header-upstash-logo');
      if (logoElement && logoElement.parentNode) {
        logoElement.parentNode.removeChild(logoElement);
      }
    };
  }, []);
  
  return null; // This component doesn't render anything
} 