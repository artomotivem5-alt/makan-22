'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const amberDotRef = useRef<SVGCircleElement>(null);
  const leftLineRef = useRef<SVGPathElement>(null);
  const rightLineRef = useRef<SVGPathElement>(null);
  const maskArchRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: onComplete,
      });

      // 1. Fade in the central logo dot
      tl.to(amberDotRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.inOut',
      })
      // 2. Trace the arch outline symmetrically from the dot upwards
      .to([leftLineRef.current, rightLineRef.current], {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: 'power2.inOut',
      })
      // 3. Fade away the solid black inside the arch (portal reveal)
      .to(maskArchRef.current, {
        opacity: 1,
        duration: 1.4,
        ease: 'power2.inOut',
      })
      // 4. Smoothly fly the logo from center to the top-left header position and fade container
      .to(logoWrapperRef.current, {
        x: -window.innerWidth / 2 + 44, // Align to navbar header logo center
        y: -window.innerHeight / 2 + 36,
        scale: 0.156, // Scale down to match navbar logo size (approx 40px)
        duration: 1.2,
        ease: 'power2.inOut',
      }, '-=0.2')
      .to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 1.0,
        ease: 'power2.inOut',
      }, '-=1.0');
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#121111] overflow-hidden"
    >
      {/* Full-screen SVG for portal masking reveal */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id="loader-mask">
            {/* White represents opaque areas (the black background) */}
            <rect width="1000" height="1000" fill="white" />
            
            {/* The arch path cuts a transparent hole in the mask when opacity > 0 */}
            <path
              ref={maskArchRef}
              d="M 500 650 L 350 650 L 350 500 A 150 150 0 0 1 650 500 L 650 650 L 500 650 Z"
              fill="black"
              style={{ opacity: 0 }}
            />
          </mask>
        </defs>

        {/* The Black Overlay, masked by the SVG definitions */}
        <rect
          width="1000"
          height="1000"
          fill="#121111"
          mask="url(#loader-mask)"
        />
      </svg>

      {/* Centered HTML container holding the visible logo to animate flight in screen space */}
      <div
        ref={logoWrapperRef}
        className="absolute z-20 w-64 h-64 flex items-center justify-center pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left tracing path: Starts at dot, goes to left base, up leg, and curves to top center */}
          <path
            ref={leftLineRef}
            d="M 50 61.5 L 35 65 L 35 50 A 15 15 0 0 1 50 35"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="65"
            strokeDashoffset="65"
          />

          {/* Right tracing path: Starts at dot, goes to right base, up leg, and curves to top center */}
          <path
            ref={rightLineRef}
            d="M 50 61.5 L 65 65 L 65 50 A 15 15 0 0 0 50 35"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="65"
            strokeDashoffset="65"
          />

          {/* Central glowing white circle */}
          <circle
            ref={amberDotRef}
            cx="50"
            cy="61.5"
            r="3.2"
            fill="#FFFFFF"
            style={{ opacity: 0 }}
            filter="drop-shadow(0 0 4px rgba(255, 255, 255, 0.85))"
          />
        </svg>
      </div>

      {/* Subtle details overlay */}
      <div className="absolute bottom-10 font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase">
        PORTAL ALIGNMENT // VECTOR FLIGHT [OK]
      </div>
    </div>
  );
}
