'use client';

import { useState } from 'react';
import { CartProvider } from '@/context/cart-context';
import Loader from '@/components/loader';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import Lounges from '@/components/lounges';
import Menu from '@/components/menu';
import Narrative from '@/components/narrative';
import Reservation from '@/components/reservation';
import Cart from '@/components/cart';
import AestheticPolish from '@/components/aesthetic-polish';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <CartProvider>
      {/* Cinematic Loader Portal */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Aesthetic Polish & Grain & Cursor */}
      <AestheticPolish />

      {/* Main Single Page Application Content */}
      <div
        className={`bg-makan-black ${loading ? 'h-screen overflow-hidden' : ''}`}
      >
        {/* Sticky Glassmorphic Navbar Header */}
        <Navbar />

        <main className="w-full min-h-screen flex flex-col items-center relative">


          <div className="sticky top-0 w-full h-screen z-10 overflow-hidden">
            <Hero />
          </div>

          <div className="relative w-full z-20 bg-makan-black">
            <Narrative />
            <Lounges />
            <Menu />
            <Reservation />
            
            {/* Sanctuary Footer */}
            <footer className="w-full bg-[#0a0a0a] border-t border-white/5 py-12 px-6 text-center text-[10px] font-mono text-white/20 tracking-[0.2em] relative z-20">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <span>© {new Date().getFullYear()} MAKAN SANCTUARY. ALL RIGHTS CALIBRATED.</span>
                <span>ESTABLISHED Cairo // EGY</span>
              </div>
            </footer>
          </div>
        </main>
        
        {/* Floating Cart Drawer & Checkout engine */}
        <Cart />

        {/* Wabi-Sabi Customized Assistant Chatbot */}
        <ChatBot />
      </div>
    </CartProvider>
  );
}
