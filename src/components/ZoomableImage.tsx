"use client";

import React, { useState, useRef, MouseEvent } from "react";

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      className="aspect-[4/5] bg-gray-50 relative overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        // Reset origin to center when leaving for a smooth un-zoom
        setTimeout(() => setPosition({ x: 50, y: 50 }), 300);
      }}
      onMouseMove={handleMouseMove}
    >
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-transform ease-out ${isHovering ? 'duration-75' : 'duration-300'}`}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isHovering ? "scale(1.8)" : "scale(1)"
        }}
      />
    </div>
  );
}
