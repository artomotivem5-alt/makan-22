'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import { useLenis } from 'lenis/react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Split-text entrance mask animation for title lines and buttons
    const tl = gsap.timeline({ delay: 1.2 });

    tl.fromTo(
      '.hero-reveal-item',
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
        stagger: 0.2,
      }
    );
  }, { scope: containerRef });

  const lenis = useLenis();

  const handleScrollToMenu = () => {
    if (lenis) {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        lenis.scrollTo(menuSection, { offset: -80 });
      }
    } else {
      const menuSection = document.getElementById('menu-section');
      if (menuSection) {
        const yOffset = -80; // offset for sticky navigation header
        const yPosition = menuSection.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({
          top: yPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleScrollToLounges = () => {
    if (lenis) {
      const loungesSection = document.getElementById('lounges-section');
      if (loungesSection) {
        lenis.scrollTo(loungesSection);
      }
    } else {
      const loungesSection = document.getElementById('lounges-section');
      if (loungesSection) {
        const yPosition = loungesSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: yPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-makan-black"
    >
      {/* Background Image Container — Next/Image for proper viewport fill */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* Desktop Background */}
        <div className="hidden md:block w-full h-full relative">
          <Image
            src="/hero_bg.png"
            alt="MAKAN sanctuary interior"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[80%_center] brightness-[0.52] scale-[1.04] animate-ken-burns"
          />
        </div>
        {/* Mobile Background */}
        <div className="block md:hidden w-full h-full relative">
          <Image
            src="/hero_bg.png"
            alt="MAKAN sanctuary interior"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[75%_25%] brightness-[0.52] scale-[1.04] animate-ken-burns"
          />
        </div>
      </div>



      {/* Precise mathematical alignment ticks */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 z-20 text-[10px] font-mono text-white/20 tracking-wider">
        <span>LAT 30.0444° N</span>
        <span>LON 31.2357° E</span>
        <div className="w-12 h-px bg-white/10 mt-1" />
      </div>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-2 z-20 text-[10px] font-mono text-white/20 tracking-wider">
        <span>GRID ID // MKN-01</span>
        <span>ELEVATION // 23M</span>
        <div className="w-12 h-px bg-white/10 mt-1" />
      </div>

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-20 text-center px-4 max-w-4xl flex flex-col items-center mt-8 sm:mt-12"
      >
        {/* MAKAN Wordmark Logo — replaces generic text h1 */}
        <div className="overflow-hidden">
          <div className="hero-reveal-item flex justify-center">
            <Image
              src="/makan-wordmark.svg"
              alt="MAKAN"
              width={400}
              height={80}
              priority
              className="w-[72%] max-w-sm sm:max-w-md md:max-w-lg h-auto select-none hero-wordmark-glow"
              draggable={false}
            />
          </div>
        </div>

        {/* Tagline — exact match to brand reference */}
        <div className="overflow-hidden mt-3">
          <p className="hero-reveal-item font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.35em] uppercase text-white/80 leading-relaxed">
            EVERY MOMENT HAS ITS{' '}
            <span className="font-bold text-white">MAKAN</span>
          </p>
        </div>

        {/* Dual CTAs with reveal wrapper */}
        <div className="overflow-hidden mt-6 w-full sm:w-auto">
          <div className="hero-reveal-item flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <button
              onClick={handleScrollToMenu}
              className="px-8 py-4 bg-ember-gold text-makan-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white hover:scale-105 shadow-lg shadow-ember-gold/15 hover:shadow-white/10 border border-ember-gold cursor-pointer"
            >
              ORDER NOW
            </button>
            
            <button
              onClick={handleScrollToLounges}
              className="px-8 py-4 bg-transparent text-plaster-sand hover:text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white/5 hover:scale-105 border border-plaster-sand/30 hover:border-white/55 cursor-pointer"
            >
              EXPLORE LOUNGES
            </button>
          </div>
        </div>
      </div>

      {/* Re-engineered custom scroll indicator (Thin gold arch with glowing dot) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <span className="text-[9px] font-mono text-white/20 tracking-[0.3em] uppercase">SCROLL</span>
        <div className="w-5 h-9 border border-ember-gold/30 rounded-t-full flex justify-center p-1.5 relative">
          <div className="w-1.5 h-1.5 bg-ember-gold rounded-full shadow-[0_0_8px_#D99B2E] animate-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
