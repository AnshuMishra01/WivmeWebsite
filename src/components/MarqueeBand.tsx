'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   MarqueeBand — Scroll-velocity-driven text strip.
   
   Creative / non-recipe-book use of GSAP:
   Instead of a constant CSS animation speed, the marquee 
   speed is DYNAMICALLY LINKED to scroll velocity via 
   ScrollTrigger.getVelocity(). When the user scrolls fast, 
   the marquee accelerates. When they stop, it gently decays 
   back to base speed. This creates a physical, reactive feel 
   — the page responds to how you interact with it.
   
   This is NOT a standard GSAP animation. It's a custom 
   physics-like system using GSAP's ticker as the clock.
   ────────────────────────────────────────────────────────── */

const WORDS = ['RECALL', 'REINFORCE', 'REMEMBER', 'RETAIN'];
const COLORS = ['#6346E6', '#E8573D', '#3B7D5E', '#D4940A'];

export default function MarqueeBand() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let position = 0;
    let currentSpeed = 1;
    const BASE_SPEED = 0.6;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        onUpdate: (self) => {
          const vel = Math.abs(self.getVelocity());
          /* Map scroll velocity to speed multiplier: 1x → 5x */
          currentSpeed = 1 + Math.min(vel / 400, 4);
        },
      });
    });

    const tickerCb = () => {
      /* Smooth exponential decay back to base speed */
      currentSpeed += (1 - currentSpeed) * 0.03;

      position -= BASE_SPEED * currentSpeed;

      /* Seamless loop: reset when first half scrolls out */
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0 && Math.abs(position) >= halfWidth) {
        position += halfWidth;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
    };

    gsap.ticker.add(tickerCb);

    return () => {
      gsap.ticker.remove(tickerCb);
      ctx.revert();
    };
  }, []);

  /* Duplicate the set once for seamless loop */
  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS];

  return (
    <div className="marquee" aria-hidden="true">
      <div
        ref={trackRef}
        className="marquee__track"
        style={{ animation: 'none' }}
      >
        {items.map((word, i) => (
          <span key={i} className="marquee__item">
            <span
              className="marquee__dot"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
