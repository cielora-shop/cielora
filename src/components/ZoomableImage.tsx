"use client";

import React, { useState, useRef, MouseEvent, useEffect } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    checkMobile(); // Check on initial client render
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className={`aspect-[4/5] bg-gray-50 relative overflow-hidden ${isMobile ? '' : 'cursor-zoom-in'}`}
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => {
        if (isMobile) return;
        setIsHovering(false);
        // Reset origin to center when leaving for a smooth un-zoom
        setTimeout(() => setPosition({ x: 50, y: 50 }), 300);
      }}
      onMouseMove={handleMouseMove}
    >
      {src.match(/\.(mp4|webm|ogg)$/i) ? (
        <video 
          src={src} 
          autoPlay 
          loop 
          muted 
          playsInline
          className={`w-full h-full object-cover transition-transform ease-out ${isHovering && !isMobile ? 'duration-75' : 'duration-300'}`}
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
            transform: isHovering && !isMobile ? "scale(1.8)" : "scale(1)"
          }}
        />
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-transform ease-out ${isHovering && !isMobile ? 'duration-75' : 'duration-300'}`}
          style={{
            transformOrigin: `${position.x}% ${position.y}%`,
            transform: isHovering && !isMobile ? "scale(1.8)" : "scale(1)"
          }}
        />
      )}
    </div>
  );
}
