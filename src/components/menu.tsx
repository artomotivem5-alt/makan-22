'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useCart, MenuItem } from '@/context/cart-context';
import { Plus, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MenuDataExtended extends MenuItem {
  description: string;
  lounge: string;
  image: string;
}

const menuItems: MenuDataExtended[] = [
  // Breakfast Lounge
  {
    id: 'croissant-salmon',
    name: 'Croissant Salmon',
    price: 216,
    category: 'Breakfast Lounge',
    lounge: 'breakfast',
    image: '/breakfast.png',
    description: 'Smoked premium Norwegian salmon, microgreens, whipped lemon cheese, toasted flaky croissant.',
  },
  {
    id: 'scramble-eggs',
    name: 'Scramble Eggs',
    price: 162,
    category: 'Breakfast Lounge',
    lounge: 'breakfast',
    image: '/breakfast.png',
    description: 'Soft double-folded creamy farm eggs, chives, toasted organic sourdough.',
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    price: 175,
    category: 'Breakfast Lounge',
    lounge: 'breakfast',
    image: '/breakfast.png',
    description: 'Avocado spread, organic poached eggs, creamy Greek feta, chili flakes, toasted sourdough.',
  },
  // Beef Lounge
  {
    id: 'tenderloin-mushroom',
    name: 'Tenderloin Mushroom',
    price: 408,
    category: 'Beef Lounge',
    lounge: 'beef',
    image: '/beef.png',
    description: 'Seared prime tenderloin fillet, sautéed field mushrooms, marrow demi-glace reduction.',
  },
  {
    id: 'king-short-ribs',
    name: 'King Short Ribs',
    price: 675,
    category: 'Beef Lounge',
    lounge: 'beef',
    image: '/beef.png',
    description: 'Slow 24-hour braised short ribs, sweet potato mash, charred shallots.',
  },
  {
    id: 'ribeye-steak',
    name: 'Ribeye Steak',
    price: 590,
    category: 'Beef Lounge',
    lounge: 'beef',
    image: '/beef.png',
    description: 'Prime 400g grass-fed ribeye steak, seared with fresh rosemary garlic butter.',
  },
  // Pizza Lounge
  {
    id: 'margherita',
    name: 'Margherita',
    price: 190,
    category: 'Pizza Lounge',
    lounge: 'pizza',
    image: '/pizza.png',
    description: 'Crushed San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil.',
  },
  {
    id: 'makan-pizza',
    name: 'Makan Pizza',
    price: 380,
    category: 'Pizza Lounge',
    lounge: 'pizza',
    image: '/pizza.png',
    description: 'Blistered sourdough crust, beef bresaola, wild arugula, shaved parmesan, white truffle oil drizzle.',
  },
  {
    id: 'truffle-mushroom-pizza',
    name: 'Truffle Mushroom Pizza',
    price: 350,
    category: 'Pizza Lounge',
    lounge: 'pizza',
    image: '/pizza.png',
    description: 'White base, wild mushrooms, fresh mozzarella, truffle oil, and baby arugula.',
  },
  // Pasta Lounge
  {
    id: 'truffle-pasta',
    name: 'Truffle Pasta',
    price: 164,
    category: 'Pasta Lounge',
    lounge: 'pasta',
    image: '/pasta.png',
    description: 'Handmade tagliatelle, black truffle paste, wild forest mushrooms, cream reduction.',
  },
  {
    id: 'seafood-rose-pasta',
    name: 'Seafood Rose Pasta',
    price: 301,
    category: 'Pasta Lounge',
    lounge: 'pasta',
    image: '/pasta.png',
    description: 'Paccheri pasta, fresh wild prawns, calamari, rich cherry tomato rose sauce.',
  },
  {
    id: 'pesto-gnocchi',
    name: 'Pesto Gnocchi',
    price: 220,
    category: 'Pasta Lounge',
    lounge: 'pasta',
    image: '/pasta.png',
    description: 'Handcrafted soft potato gnocchi tossed in aromatic basil pesto and toasted pine nuts.',
  },
  // Drinks
  {
    id: 'v60-coffee',
    name: 'V60 Coffee',
    price: 144,
    category: 'Drinks',
    lounge: 'drinks',
    image: '/v60.png',
    description: 'Slow drip filter coffee, single-origin berries, served over custom carved ice.',
  },
  {
    id: 'pistachio-milkshake',
    name: 'Pistachio Milkshake',
    price: 138,
    category: 'Drinks',
    lounge: 'drinks',
    image: '/v60.png',
    description: 'Whipped pistachio paste, organic vanilla bean cream, cold organic whole milk.',
  },
  {
    id: 'iced-matcha',
    name: 'Iced Matcha',
    price: 109,
    category: 'Drinks',
    lounge: 'drinks',
    image: '/v60.png',
    description: 'Uji matcha stone-ground, light raw honey, cold organic oat milk.',
  },
  {
    id: 'spanish-latte',
    name: 'Spanish Latte',
    price: 115,
    category: 'Drinks',
    lounge: 'drinks',
    image: '/v60.png',
    description: 'Double shot espresso, sweet condensed milk, and organic cold milk.',
  },
];

const categories = [
  { id: 'all', name: 'ALL SANCTUARIES', image: '/hero_bg.png' },
  { id: 'breakfast', name: 'BREAKFAST', image: '/breakfast.png' },
  { id: 'pizza', name: 'PIZZA LOUNGE', image: '/pizza.png' },
  { id: 'beef', name: 'BEEF LOUNGE', image: '/beef.png' },
  { id: 'pasta', name: 'PASTA LOUNGE', image: '/pasta.png' },
  { id: 'drinks', name: 'DRINKS', image: '/v60.png' },
];

export default function Menu() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isManualScrollRef = useRef<boolean>(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // 1. IntersectionObserver for Swipe-to-Update Tab Sync
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const observerOptions = {
      root: scrollContainer,
      rootMargin: '0px',
      threshold: 0.6, // Fire when 60% of the panel is visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Prevent sync loops when scrolling manually via tab clicks
      if (isManualScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.getAttribute('data-category');
          if (categoryId) {
            setSelectedCategory(categoryId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const panels = scrollContainer.querySelectorAll('.panel-element');
    panels.forEach((panel) => observer.observe(panel));

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Active Tab Centering Scroll Effect
  useEffect(() => {
    const activeTab = tabRefs.current[selectedCategory];
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedCategory]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const targetPanel = scrollContainer.querySelector(`[data-category="${catId}"]`);
      if (targetPanel) {
        // Lock Observer updates during the smooth-scroll transition
        isManualScrollRef.current = true;
        
        targetPanel.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });

        // Release lock once scroll finishes (usually 600-800ms)
        setTimeout(() => {
          isManualScrollRef.current = false;
        }, 800);
      }
    }
  };

  useGSAP(() => {
    // Menu title reveal
    gsap.fromTo('.menu-header-reveal',
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'power2.inOut',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.menu-header-reveal',
          start: 'top 92%',
        }
      }
    );

    // Parallax scroll background effect
    gsap.fromTo('.menu-parallax-bg',
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#menu-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  return (
    <section
      ref={containerRef}
      id="menu-section"
      className="relative w-full py-24 px-6 bg-[#0c0c0c] text-white overflow-hidden border-t border-white/5"
    >
      {/* Cinematic Parallax Background */}
      <div className="menu-parallax-bg absolute inset-0 -top-[15%] -bottom-[15%] z-0 opacity-30 pointer-events-none">
        <Image
          src="/hero_bg.png"
          alt="Parallax Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.35] sepia-[0.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-transparent to-[#0c0c0c]" />
      </div>

      <div className="absolute inset-0 engineering-grid opacity-10 pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 relative z-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-2">
            <div className="overflow-hidden">
              <span className="menu-header-reveal block text-[10px] font-mono text-ember-gold tracking-[0.4em] uppercase">
                [ SANCTUARY // GASTRONOMY ]
              </span>
            </div>
            <div className="overflow-hidden">
              <h2 className="menu-header-reveal block font-heading font-semibold text-3xl sm:text-5xl tracking-tight uppercase">
                THE ARTISANAL MENU
              </h2>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="menu-header-reveal block font-story italic text-plaster-sand/60 text-base max-w-sm">
              Each recipe represents a calibrated culinary equation of raw organic materials, temperature, and time.
            </p>
          </div>
        </div>

        {/* STICKY GLASSMORPHIC CATEGORY NAVIGATION */}
        <div className="sticky top-[72px] z-30 -mx-6 px-6 py-4 bg-[#0c0c0c]/85 backdrop-blur-md border-b border-white/5 overflow-x-auto no-scrollbar flex items-center justify-start gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[cat.id] = el;
              }}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-3 px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all duration-500 border rounded-none cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-ember-gold text-makan-black border-ember-gold font-semibold scale-105'
                  : 'bg-transparent text-plaster-sand/60 border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              {/* Category Mini Arch Thumbnail */}
              <div className="relative w-4 h-6 flex-shrink-0 border border-white/10 overflow-hidden makan-arch">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="16px"
                  className="object-cover brightness-90"
                />
              </div>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Swipeable Panels Wrapper */}
        <div
          ref={scrollContainerRef}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide w-full touch-pan-y"
        >
          {categories.map((cat) => {
            const panelItems = cat.id === 'all'
              ? menuItems
              : menuItems.filter(item => item.lounge === cat.id);

            return (
              <div
                key={cat.id}
                data-category={cat.id}
                className="panel-element min-w-full flex-shrink-0 snap-center md:px-2"
              >
                {/* Scrollable vertical grid inside panel */}
                <div className="h-[600px] md:h-[680px] overflow-y-auto no-scrollbar scroll-smooth grid grid-cols-1 md:grid-cols-2 gap-6 py-4 pr-2">
                  {panelItems.map((item) => {
                    const isAdded = addedItems[item.id];
                    const isExpanded = expandedItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        className={`group flex flex-col p-3.5 sm:p-5 bg-[#121111]/30 backdrop-blur-sm border transition-all duration-500 ease-cinematic-slow relative cursor-pointer select-none h-fit ${
                          isExpanded ? 'border-ember-gold bg-[#121111]/70' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Micro engineering coordinates */}
                        <div className="absolute top-2 right-2 font-mono text-[7px] sm:text-[8px] text-white/10 uppercase tracking-widest">
                          ITEM_ID // {item.id.toUpperCase().replace('-', '_')}
                        </div>

                        {/* Summary Header */}
                        <div className="flex gap-4 items-center">
                          {/* Left: Item image masked by arch */}
                          <div className="relative w-14 h-18 sm:w-16 sm:h-20 flex-shrink-0 border border-white/5 overflow-hidden makan-arch select-none">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-[1200ms] group-hover:scale-110 brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-makan-black/30 to-transparent" />
                          </div>

                          {/* Right: Content details */}
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div>
                              <span className="text-[7px] sm:text-[8px] font-mono text-ember-gold tracking-widest uppercase block">
                                {item.category}
                              </span>
                              <h3 className="font-heading font-semibold text-sm sm:text-base tracking-wide uppercase text-white group-hover:text-ember-gold transition-colors duration-300">
                                {item.name}
                              </h3>
                            </div>

                            <span className="font-mono text-xs sm:text-sm text-plaster-sand font-medium mt-1 block">
                              {item.price} <span className="text-[10px] text-plaster-sand/60">L.E</span>
                            </span>
                          </div>
                        </div>

                        {/* Collapsible details (Accordion mechanic to save space on mobile) */}
                        <div
                          className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="overflow-hidden flex flex-col gap-3.5 text-left">
                            <p className="text-[11px] sm:text-xs text-text-dark-muted font-sans leading-relaxed">
                              {item.description}
                            </p>

                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid closing the accordion when clicking button
                                handleAddToCart(item);
                              }}
                              className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase transition-all duration-500 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white/5 text-plaster-sand hover:bg-ember-gold hover:text-makan-black'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  ADDED TO ORDER
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  ADD TO ORDER
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
