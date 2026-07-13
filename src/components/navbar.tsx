'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/cart-context';
import { ShoppingBag } from 'lucide-react';
import { useLenis } from 'lenis/react';

export default function Navbar() {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lenis = useLenis();

  const handleScrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      // Small delay to let the drawer close animation finish first
      setTimeout(() => {
        const yOffset = id === 'menu-section' ? -80 : 0; // offset for sticky navbar in menu section
        if (lenis) {
          lenis.scrollTo(el, { offset: yOffset });
        } else {
          const yPosition = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({
            top: yPosition,
            behavior: 'smooth',
          });
        }
      }, 300);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 px-6 flex items-center justify-between transition-all duration-500 border-b ${
          scrolled
            ? 'bg-[#121111]/90 backdrop-blur-md pointer-events-auto py-3 border-white/[0.04]'
            : 'bg-transparent pointer-events-none py-4 border-transparent'
        }`}
      >
        {/* Left: Logo (clickable and pointer-events-auto) */}
        <div
          onClick={() => lenis ? lenis.scrollTo('top') : window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer select-none pointer-events-auto"
        >
          <div className="w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="50" fill="#000000" />
              <path
                d="M 32 68 L 32 46 A 18 18 0 0 1 68 46 L 68 68"
                stroke="#FFFFFF"
                strokeWidth="5.5"
                strokeLinecap="round"
              />
              <circle cx="50" cy="62" r="5.5" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="font-heading font-semibold text-lg tracking-widest text-white uppercase hidden sm:inline-block">
            MAKAN
          </span>
        </div>

        {/* Center: Empty (visible links removed) */}
        <div className="flex-1" />

        {/* Right: Actions (Cart & Hamburger Menu) */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Cart Icon trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-plaster-sand hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ember-gold text-makan-black font-mono font-bold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 p-2 bg-white/5 border border-white/10 hover:border-ember-gold/40 text-white rounded-none cursor-pointer transition-colors duration-300 relative z-50"
            aria-label="Toggle Menu"
          >
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* FULL SCREEN NAVIGATION OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-makan-black/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-700 ease-cinematic-slow ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 plaster-texture opacity-5 pointer-events-none" />
        <div className="absolute inset-0 engineering-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <span className="text-[10px] font-mono text-ember-gold tracking-[0.4em] uppercase">
            [ PORTAL // NAVIGATION ]
          </span>

          <nav className="flex flex-col gap-6 text-2xl font-heading font-medium tracking-[0.15em] text-plaster-sand uppercase">
            <button
              onClick={() => handleScrollToSection('lounges-section')}
              className="hover:text-ember-gold hover:scale-105 transition-all duration-300 uppercase py-2 cursor-pointer"
            >
              LOUNGES
            </button>
            <button
              onClick={() => handleScrollToSection('menu-section')}
              className="hover:text-ember-gold hover:scale-105 transition-all duration-300 uppercase py-2 cursor-pointer"
            >
              MENU
            </button>
            <button
              onClick={() => handleScrollToSection('reservations-section')}
              className="hover:text-ember-gold hover:scale-105 transition-all duration-300 uppercase py-2 cursor-pointer"
            >
              RESERVATIONS
            </button>
          </nav>

          <div className="w-12 h-px bg-white/10 mt-2" />

          {/* Sleek Prominent [ORDER NOW] CTA */}
          <button
            onClick={() => handleScrollToSection('menu-section')}
            className="px-10 py-4 bg-ember-gold text-makan-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white hover:scale-105 shadow-xl shadow-ember-gold/15 cursor-pointer"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </>
  );
}
