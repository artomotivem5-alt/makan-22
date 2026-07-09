'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart, MenuItem } from '@/context/cart-context';
import { X, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Lounge {
  id: string;
  name: string;
  description: string;
  image: string;
  tagline: string;
}

const loungesData: Lounge[] = [
  {
    id: 'breakfast',
    name: 'Breakfast Lounge',
    description: 'Artisanal croissants, farm scramble eggs, and fresh morning fuel.',
    image: '/breakfast.png',
    tagline: '08:00 AM - 12:00 PM // MORNING ASCENT',
  },
  {
    id: 'pizza',
    name: 'Pizza Lounge',
    description: 'Blistered wood-fired pizzas with slow-fermented organic dough.',
    image: '/pizza.png',
    tagline: '12:00 PM - 11:00 PM // WOOD FIRE CRAFT',
  },
  {
    id: 'beef',
    name: 'Beef Lounge',
    description: 'Prime cuts seared under intense coals and served with reductions.',
    image: '/beef.png',
    tagline: '02:00 PM - 11:00 PM // HIGH HEARTH',
  },
  {
    id: 'pasta',
    name: 'Pasta Lounge',
    description: 'Rich handmade pasta tossed with truffles, herbs, and fresh seafood.',
    image: '/pasta.png',
    tagline: '12:00 PM - 11:00 PM // CRAFT PASTA',
  },
  {
    id: 'drinks',
    name: 'Cold & Brew Lounge',
    description: 'Filter pour-overs, ice matcha, and whipped cold milkshakes.',
    image: '/v60.png',
    tagline: 'ALL DAY // DEEP EXTRACTION',
  },
];

// Menu items mapping
const menuItemsByLounge: Record<string, MenuItem[]> = {
  breakfast: [
    { id: 'croissant-salmon', name: 'Croissant Salmon', price: 216, category: 'Breakfast Lounge' },
    { id: 'scramble-eggs', name: 'Scramble Eggs', price: 162, category: 'Breakfast Lounge' },
  ],
  pizza: [
    { id: 'margherita', name: 'Margherita', price: 190, category: 'Pizza Lounge' },
    { id: 'makan-pizza', name: 'Makan Pizza', price: 380, category: 'Pizza Lounge' },
  ],
  beef: [
    { id: 'tenderloin-mushroom', name: 'Tenderloin Mushroom', price: 408, category: 'Beef Lounge' },
    { id: 'king-short-ribs', name: 'King Short Ribs', price: 675, category: 'Beef Lounge' },
  ],
  pasta: [
    { id: 'truffle-pasta', name: 'Truffle Pasta', price: 164, category: 'Pasta Lounge' },
    { id: 'seafood-rose-pasta', name: 'Seafood Rose Pasta', price: 301, category: 'Pasta Lounge' },
  ],
  drinks: [
    { id: 'v60-coffee', name: 'V60 Coffee', price: 144, category: 'Drinks' },
    { id: 'pistachio-milkshake', name: 'Pistachio Milkshake', price: 138, category: 'Drinks' },
    { id: 'iced-matcha', name: 'Iced Matcha', price: 109, category: 'Drinks' },
  ],
};

const menuDescriptions: Record<string, string> = {
  'croissant-salmon': 'Smoked premium Norwegian salmon, microgreens, whipped lemon cheese, toasted flaky croissant.',
  'scramble-eggs': 'Soft double-folded creamy farm eggs, chives, toasted organic sourdough.',
  'tenderloin-mushroom': 'Seared prime tenderloin fillet, sautéed field mushrooms, marrow demi-glace reduction.',
  'king-short-ribs': 'Slow 24-hour braised short ribs, sweet potato mash, charred shallots.',
  'margherita': 'Crushed San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil.',
  'makan-pizza': 'Blistered sourdough crust, beef bresaola, wild arugula, shaved parmesan, white truffle oil drizzle.',
  'truffle-pasta': 'Handmade tagliatelle, black truffle paste, wild forest mushrooms, cream reduction.',
  'seafood-rose-pasta': 'Paccheri pasta, fresh wild prawns, calamari, rich cherry tomato rose sauce.',
  'v60-coffee': 'Slow drip filter coffee, single-origin berries, served over custom carved ice.',
  'pistachio-milkshake': 'Whipped pistachio paste, organic vanilla bean cream, cold organic whole milk.',
  'iced-matcha': 'Uji matcha stone-ground, light raw honey, cold organic oat milk.',
};

export default function Lounges() {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeBg, setActiveBg] = useState(loungesData[0].image);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Animate the floating scroll indicator
    gsap.fromTo('.scroll-explore-indicator',
      { y: 0 },
      {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: 'power1.inOut'
      }
    );
  }, { scope: containerRef });

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
      const children = container.children;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const distance = Math.abs(childCenter - containerCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
        setActiveBg(loungesData[closestIndex].image);
      }
    }, 60);
  };

  const scrollPrev = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const nextIndex = Math.max(0, activeIndex - 1);
    const targetChild = container.children[nextIndex] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(nextIndex);
      setActiveBg(loungesData[nextIndex].image);
    }
  };

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const nextIndex = Math.min(loungesData.length - 1, activeIndex + 1);
    const targetChild = container.children[nextIndex] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(nextIndex);
      setActiveBg(loungesData[nextIndex].image);
    }
  };

  const handleCardClick = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(index);
      setActiveBg(loungesData[index].image);
    }
  };

  const handleScrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      const yOffset = -80; // offset for sticky navigation header
      const yPosition = menuSection.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({
        top: yPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const currentDrawerLounge = loungesData.find(l => l.id === activeDrawer);

  return (
    <section
      ref={containerRef}
      id="lounges-section"
      className="relative w-full min-h-screen flex flex-col justify-center pt-28 pb-20 md:py-24 px-6 bg-makan-black overflow-hidden border-t border-b border-white/5"
    >
      {/* Dynamic Blurred Background Layer (Makan ambient glow wave transition) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[1000ms] ease-in-out z-0 scale-110 pointer-events-none"
        style={{
          backgroundImage: `url('${activeBg}')`,
          filter: 'blur(45px) brightness(0.18)',
        }}
      />

      {/* Engineering overlay grid lines */}
      <div className="absolute inset-0 engineering-grid z-10 opacity-30 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col gap-12 items-center text-center">
        {/* Header */}
        <div className="max-w-xl flex flex-col items-center gap-4">
          <span className="text-[10px] font-mono text-ember-gold tracking-[0.4em] uppercase">
            [ ARCHITECTURE // LOUNGES ]
          </span>
          <h2 className="font-heading font-semibold text-3xl sm:text-5xl text-white tracking-tight">
            INTERACTIVE LOUNGES
          </h2>
          <p className="font-story italic text-plaster-sand/70 text-base leading-relaxed">
            Select or swipe through the lounges below to explore exclusive sensory experiences.
          </p>
        </div>

        {/* Horizontal Snap Slider Carousel */}
        <div className="relative w-full flex items-center mt-6 group/carousel">
          {/* Left Arrow Button */}
          <button
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            className="absolute left-1 sm:left-4 z-30 p-2 sm:p-3 bg-black/60 border border-white/10 hover:border-ember-gold text-plaster-sand hover:text-white disabled:opacity-0 transition-all duration-300 rounded-full cursor-pointer flex"
            aria-label="Previous Lounge"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Carousel Track Container (no scroll-smooth to prevent snaps conflict) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-8 pb-8 pt-4 w-full px-[12.5vw] sm:px-[32.5vw] md:px-[39vw]"
          >
            {loungesData.map((lounge, index) => {
              const isFire = lounge.id === 'pizza' || lounge.id === 'beef' || lounge.id === 'breakfast';
              const isActive = activeIndex === index;

              return (
                <div
                  key={lounge.id}
                  onClick={() => handleCardClick(index)}
                  className={`flex flex-col flex-shrink-0 w-[75vw] sm:w-[35vw] md:w-[22vw] snap-center cursor-pointer transition-all duration-700 ease-cinematic-slow ${
                    isActive ? 'opacity-100 scale-105' : 'opacity-30 scale-95'
                  }`}
                >
                  {/* Arch Card Frame with active halo glow */}
                  <div
                    className={`relative w-full aspect-[2/3] makan-arch-border mb-6 transition-all duration-700 ${
                      isActive
                        ? isFire
                          ? 'shadow-[0_0_30px_rgba(217,155,46,0.3)]'
                          : 'shadow-[0_0_30px_rgba(14,165,233,0.22)]'
                        : 'shadow-none'
                    }`}
                  >
                    <div className="w-full h-full makan-arch overflow-hidden bg-zinc-900 relative">
                      <Image
                        src={lounge.image}
                        alt={lounge.name}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 72vw, 25vw"
                        className={`object-cover transition-all duration-[1200ms] ${
                          isActive ? 'scale-110 brightness-100' : 'scale-100 brightness-75'
                        }`}
                      />
                      
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-makan-black via-transparent to-transparent transition-opacity duration-700 ${
                          isActive ? 'opacity-85' : 'opacity-65'
                        }`}
                      />

                      {/* Dynamic Cinematic Warm/Cold lighting glow (amplified opacity) */}
                      <div
                        className={`absolute inset-0 z-15 pointer-events-none transition-all duration-[1200ms] ${
                          isActive
                            ? isFire
                              ? 'bg-[radial-gradient(circle_at_50%_40%,rgba(217,155,46,0.42),transparent_65%)] mix-blend-screen opacity-100'
                              : 'bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.35),transparent_65%)] mix-blend-screen opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content details */}
                  <div className="flex flex-col gap-1 text-center">
                    <span className="text-[9px] font-mono text-ember-gold tracking-widest block uppercase">
                      {lounge.tagline}
                    </span>
                    <h3 className="font-heading font-medium text-lg text-white uppercase mt-1">
                      {lounge.name}
                    </h3>
                    <p className="text-xs text-text-dark-muted font-sans leading-relaxed max-w-sm mx-auto">
                      {lounge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollNext}
            disabled={activeIndex === loungesData.length - 1}
            className="absolute right-1 sm:right-4 z-30 p-2 sm:p-3 bg-black/60 border border-white/10 hover:border-ember-gold text-plaster-sand hover:text-white disabled:opacity-0 transition-all duration-300 rounded-full cursor-pointer flex"
            aria-label="Next Lounge"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Dual Actions Controls Panel */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 z-20">
          <button
            onClick={() => setActiveDrawer(loungesData[activeIndex].id)}
            className="px-8 py-4 bg-ember-gold text-makan-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white hover:scale-105 shadow-lg shadow-ember-gold/15 border border-ember-gold cursor-pointer"
          >
            EXPLORE {loungesData[activeIndex].name.toUpperCase()}
          </button>
          <button
            onClick={handleScrollToMenu}
            className="px-8 py-4 bg-transparent text-plaster-sand hover:text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:bg-white/5 hover:scale-105 border border-plaster-sand/30 hover:border-white/55 cursor-pointer"
          >
            SCROLL TO MENU
          </button>
        </div>

        {/* Slide Counter Indicator */}
        <div className="font-mono text-[10px] text-white/40 tracking-[0.2em] select-none">
          <span className="text-white">{String(activeIndex + 1).padStart(2, '0')}</span> {/* 05 */}
        </div>
      </div>

      {/* Dynamic Glassmorphic Bottom Sheet Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${
          activeDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setActiveDrawer(null)}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#0c0c0c]/80 backdrop-blur-3xl border-t border-white/10 rounded-t-[32px] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
          activeDrawer ? 'translate-y-0' : 'translate-y-full'
        } max-h-[82vh] flex flex-col shadow-2xl shadow-black/80`}
      >
        {/* Drag/Swipe Bar Indicator */}
        <button
          onClick={() => setActiveDrawer(null)}
          className="w-full flex justify-center py-4 cursor-pointer select-none group"
          aria-label="Close menu drawer"
        >
          <div className="w-12 h-1 bg-white/20 group-hover:bg-ember-gold/60 rounded-full transition-colors duration-300" />
        </button>

        {currentDrawerLounge && (
          <>
            {/* Drawer Header */}
            <div className="px-6 pb-4 flex justify-between items-start border-b border-white/5">
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] text-ember-gold tracking-[0.3em] uppercase">
                  {currentDrawerLounge.tagline}
                </span>
                <h3 className="font-heading font-medium text-xl sm:text-2xl text-white uppercase mt-1">
                  {currentDrawerLounge.name} Menu
                </h3>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-2 bg-white/5 border border-white/10 hover:border-ember-gold text-plaster-sand hover:text-white transition-all duration-300 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu items list */}
            <div className="p-6 overflow-y-auto no-scrollbar flex-1 pb-16">
              <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
                {menuItemsByLounge[currentDrawerLounge.id]?.map((item) => {
                  const isAdded = addedItems[item.id];
                  const desc = menuDescriptions[item.id] || '';

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.02] border border-white/5 p-6 hover:border-ember-gold/20 transition-all duration-500 gap-4"
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <h4 className="font-heading font-medium text-lg text-white uppercase tracking-wider">
                          {item.name}
                        </h4>
                        <p className="text-xs text-text-dark-muted leading-relaxed font-sans max-w-md">
                          {desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                        <span className="font-mono text-base text-plaster-sand font-medium whitespace-nowrap">
                          {item.price} L.E
                        </span>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-500 ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white/5 text-plaster-sand hover:bg-ember-gold hover:text-makan-black'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              ADDED
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              ADD TO CART
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
