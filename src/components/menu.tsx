'use client';

import { useState, useRef } from 'react';
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
  { id: 'breakfast', name: 'BREAKFAST', image: '/breakfast.png' },
  { id: 'pizza', name: 'PIZZA LOUNGE', image: '/pizza.png' },
  { id: 'beef', name: 'BEEF LOUNGE', image: '/beef.png' },
  { id: 'pasta', name: 'PASTA LOUNGE', image: '/pasta.png' },
  { id: 'drinks', name: 'DRINKS', image: '/v60.png' },
];

export default function Menu() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('breakfast');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
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
          trigger: containerRef.current,
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
      className="relative w-full py-24 bg-[#0c0c0c] text-white overflow-x-clip border-t border-white/5"
    >
      {/* Cinematic Parallax Background — made more visible */}
      <div className="menu-parallax-bg absolute inset-0 -top-[20%] -bottom-[20%] z-0 opacity-50 pointer-events-none">
        <Image
          src="/hero_bg.png"
          alt="Parallax Background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.45] sepia-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/40 to-[#0c0c0c]" />
      </div>

      <div className="absolute inset-0 engineering-grid opacity-10 pointer-events-none z-10" />

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-12 relative z-20 px-6">
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
        <div className="sticky top-[64px] z-30 -mx-6 px-6 py-4 bg-[#0c0c0c]/85 backdrop-blur-md border-b border-white/5 overflow-x-auto no-scrollbar flex items-center justify-start gap-4">
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

        {/* Filtered Vertical Menu List — simple, scrollable, no fixed height */}
        <div className="flex flex-col py-2">
          {menuItems.filter(item => item.lounge === selectedCategory).map((item) => {
            const isAdded = addedItems[item.id];

            return (
              /* ── STRICT CARD ANATOMY: flex-row, no background, border-b separator ── */
              <div
                key={item.id}
                className="w-full max-w-md mx-auto flex flex-row items-start gap-4 py-5 border-b border-white/10"
              >
                {/* LEFT: Arch Image — flex-shrink-0 prevents squishing */}
                <div className="flex-shrink-0 relative w-20 h-24 min-w-[5rem] overflow-hidden makan-arch border border-white/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-makan-black/30 to-transparent" />
                </div>

                {/* RIGHT: Data Container — min-w-0 prevents text overflow */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* Category micro-label */}
                  <span className="text-[8px] font-mono text-ember-gold tracking-widest uppercase block mb-0.5">
                    {item.category}
                  </span>

                  {/* Title */}
                  <h3 className="font-heading font-semibold text-sm tracking-wide uppercase text-white truncate">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="font-story text-white/50 text-xs leading-relaxed mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price & Action Row */}
                  <div className="flex flex-row justify-between items-center mt-3">
                    <span className="font-mono text-sm text-ember-gold font-medium">
                      {item.price} <span className="text-[10px] text-plaster-sand/50">L.E</span>
                    </span>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`flex items-center gap-1.5 border rounded-full px-4 py-1 text-[10px] uppercase tracking-widest transition-all duration-500 cursor-pointer ${
                        isAdded
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                          : 'border-white/20 text-plaster-sand/70 hover:border-ember-gold hover:text-ember-gold'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          Added
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          Add
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
    </section>
  );
}
