'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   CallToAction — Character-assembly animation.
   
   Creative choice (the "new recipe"):
   Instead of a standard fade-in, the headline text starts 
   with each character scattered — random positions, scales, 
   rotations, zero opacity. As the section enters the viewport, 
   GSAP assembles every character into its correct position 
   with staggered timing and expo easing.
   
   The visual metaphor: scattered knowledge assembling into 
   clarity. This is what Wivme does — it takes scattered 
   fragments of understanding and reassembles them into 
   lasting memory.
   
   This is NOT a standard GSAP animation. Characters start 
   in randomized states — every visit produces slightly 
   different entrance paths.
   ────────────────────────────────────────────────────────── */

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headlineRef.current) return;

    const ctx = gsap.context(() => {
      const headline = headlineRef.current!;
      const text = headline.textContent || '';
      headline.innerHTML = '';
      headline.style.position = 'relative';

      const chars: HTMLSpanElement[] = [];

      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.willChange = 'transform, opacity';
        headline.appendChild(span);
        chars.push(span);
      });

      /* Scatter characters to random positions */
      chars.forEach((ch) => {
        gsap.set(ch, {
          x: (Math.random() - 0.5) * 180,
          y: (Math.random() - 0.5) * 80,
          opacity: 0,
          scale: 0.4 + Math.random() * 0.4,
          rotation: (Math.random() - 0.5) * 25,
        });
      });

      /* Assemble on scroll */
      gsap.to(chars, {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.018,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          once: true,
        },
      });

      /* Action buttons — simple fade after headline assembles */
      gsap.from('.cta__actions', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cta dark-s">
      <div className="container">
        <h2 ref={headlineRef} className="cta__headline">
          Protect learning after class.
        </h2>
        <div className="cta__actions">
          <button className="btn btn--violet">Get early access</button>
          <button className="btn btn--outline">Talk to our team</button>
        </div>

      </div>
    </section>
  );
}
