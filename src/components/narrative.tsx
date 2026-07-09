'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Narrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Typewriter Scroll Reveal on the Emotional Anchor sentence (Letter-by-letter stagger reveal)
    gsap.fromTo(
      '.anchor-text-char',
      { opacity: 0, filter: 'blur(3px)', y: 3 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.05, // elegant stagger duration
        duration: 0.35,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: anchorRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Brick background momentary scroll effect
    const bgTl = gsap.timeline({
      scrollTrigger: {
        trigger: anchorRef.current,
        start: 'top 30%', // Triggers after the text reveal (which is at 75%)
        end: 'bottom top',
        scrub: true, // Momentary with the scroll
      }
    });

    // Fade in, hold, then fade out
    bgTl.to('.brick-bg', { opacity: 1, duration: 1 })
        .to('.anchor-text-char', { color: '#121111', duration: 1 }, '<')
        .to('.brick-bg', { opacity: 0, duration: 1 }, "+=0.5")
        .to('.anchor-text-char', { color: '#DBCFB0', duration: 1 }, '<');

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full relative bg-[#121111] border-b border-white/5 overflow-hidden">
      
      {/* Brick background that fades in/out with scroll */}
      <div className="brick-bg absolute inset-0 z-0 opacity-0 pointer-events-none">
        <Image
          src="/narrative_bg.png"
          alt="Beige Wabi-sabi Wall texture"
          fill
          sizes="100vw"
          className="object-cover brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121111] via-transparent to-[#121111] opacity-90" />
      </div>

      <div className="absolute inset-0 engineering-grid opacity-25 pointer-events-none z-0" />
      
      {/* 3. EMOTIONAL ANCHOR SECTION */}
      <section
        ref={anchorRef}
        className="w-full min-h-[80vh] md:min-h-[100vh] flex flex-col items-center justify-center px-6 py-20 text-center relative z-10"
      >
        <div className="max-w-4xl relative z-10 flex flex-col items-center gap-4">
          <span className="text-[10px] font-mono text-ember-gold tracking-[0.4em] uppercase mb-2 block">
            [ SECTION 02 // COGNITIVE ANCHOR ]
          </span>
          <h2 className="font-story italic text-plaster-sand text-2xl sm:text-4xl md:text-5xl leading-relaxed max-w-3xl select-none">
            {`With every page you turn, a choice is made and a moment begins.`.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-2.5 sm:mr-3.5">
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex} className="anchor-text-char opacity-0 inline-block">
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <div className="w-8 h-px bg-ember-gold mt-6" />
        </div>
      </section>
    </div>
  );
}
