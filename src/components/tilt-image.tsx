'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

interface TiltImageProps {
  src: string;
  alt: string;
  className?: string;
  telemetryLabel?: string;
}

export default function TiltImage({ src, alt, className = '', telemetryLabel }: TiltImageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    // Subtle 3D tilt coordinates
    const tiltX = (0.5 - yPct) * 16;
    const tiltY = (xPct - 0.5) * 16;

    gsap.to(el, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4,
    });

    if (glare) {
      gsap.to(glare, {
        background: `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
        opacity: 1,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      ease: 'power2.out',
      duration: 0.8,
    });

    if (glare) {
      gsap.to(glare, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const glare = glareRef.current;
    if (!el || e.touches.length === 0) return;

    const touch = e.touches[0];
    const rect = el.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const tiltX = (0.5 - yPct) * 12;
    const tiltY = (xPct - 0.5) * 12;

    gsap.to(el, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 800,
      ease: 'power2.out',
      duration: 0.4,
    });

    if (glare) {
      gsap.to(glare, {
        background: `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
        opacity: 1,
        duration: 0.2,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className={`relative w-full h-full select-none transform-style-3d will-change-transform ${className}`}
    >
      <div className="w-full h-full overflow-hidden relative">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover scale-105 transition-transform duration-[2000ms] hover:scale-100 brightness-90"
        />
        {/* Dynamic glare shine */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none z-20 opacity-0 mix-blend-overlay transition-opacity duration-300"
        />
        {/* Shading overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-10" />

        {telemetryLabel && (
          <div className="absolute top-4 left-4 font-mono text-[9px] text-white/40 uppercase tracking-widest bg-black/45 backdrop-blur-sm px-2.5 py-1.5 z-20">
            {telemetryLabel}
          </div>
        )}
      </div>
    </div>
  );
}
