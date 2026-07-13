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
    if (!anchorRef.current) return;

    // Letter-by-letter typewriter stagger reveal — expert-level cinematic effect
    // Each character fades from transparent+blurred to crisp, with a slow stagger
    gsap.fromTo(
      '.anchor-text-char',
      {
        opacity: 0,
        filter: 'blur(4px)',
        y: 6,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.04, // 40ms per character — slow, deliberate, cinematic
        duration: 0.4,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: anchorRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animate the gold decorative line after the text completes
    gsap.fromTo(
      '.anchor-gold-line',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: anchorRef.current,
          start: 'top 45%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Subtle section label fade-in
    gsap.fromTo(
      '.anchor-label',
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: anchorRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

  }, { scope: containerRef });

  const anchorText = 'With every page you turn, a choice is made and a moment begins.';

  return (
    <div ref={containerRef} className="w-full relative overflow-hidden">

      {/* PERMANENT BEIGE TADELAKT PLASTER BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/narrative_bg_mobile.png"
          alt="Warm tadelakt plaster wall texture"
          fill
          sizes="100vw"
          className="object-cover brightness-[0.55] sepia-[0.25]"
          priority
        />
        {/* Warm leather overlay to darken the beige into brand-consistent tones */}
        <div className="absolute inset-0 bg-leather-brown/40" />
        {/* Strong vignette edges for cinematic blending with adjacent dark sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-makan-black/80 via-makan-black/15 to-makan-black/80" />
      </div>

      {/* Engineering measurement grid — subtle overlay */}
      <div className="absolute inset-0 engineering-grid opacity-15 pointer-events-none z-[1]" />

      {/* COGNITIVE ANCHOR SECTION */}
      <section
        ref={anchorRef}
        className="w-full min-h-[85vh] md:min-h-[100vh] flex flex-col items-center justify-center px-6 sm:px-10 py-24 text-center relative z-10"
      >
        <div className="max-w-3xl relative z-10 flex flex-col items-center gap-6">
          {/* Section label */}
          <span className="anchor-label text-[10px] font-mono text-plaster-sand/60 tracking-[0.4em] uppercase mb-4 block">
            [ SECTION 02 // COGNITIVE ANCHOR ]
          </span>

          {/* The Emotional Anchor text — each character is individually animated */}
          <h2 className="font-story italic text-plaster-sand text-2xl sm:text-3xl md:text-[2.75rem] leading-[1.6] sm:leading-[1.65] max-w-2xl select-none">
            {anchorText.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.35em]">
                {word.split('').map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="anchor-text-char opacity-0 inline-block"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h2>

          {/* Gold accent line */}
          <div className="anchor-gold-line w-12 h-[1.5px] bg-ember-gold mt-4 origin-left" />
        </div>
      </section>
    </div>
  );
}
