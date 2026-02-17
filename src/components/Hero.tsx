'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import MeshGradient from './MeshGradient';

/* ──────────────────────────────────────────────────────────
   Hero — The first impression.
   
   Creative choices:
   1. Three.js MeshGradient replaces flat accent block — the 
      background breathes and responds to the mouse.
   2. Word-by-word GSAP reveal — each word pops from below 
      its overflow-hidden wrapper with expo easing.
   3. "forget" gets a pulsing opacity loop after reveal — 
      a visual metaphor for fading memory. Not decorative.
   4. Overlapping image placeholder bleeds across section 
      boundary — editorial tension / asymmetry.
   5. Subtle scroll-driven parallax on headline and visual.
   ────────────────────────────────────────────────────────── */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const annotationRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    if (!section || !headline) return;

    const ctx = gsap.context(() => {
      const words = headline.querySelectorAll<HTMLSpanElement>('.word-inner');

      /* ─── Main entrance timeline ─── */
      const tl = gsap.timeline({ delay: 0.4 });

      // Words reveal with staggered expo.out
      tl.to(words, {
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.09,
      });

      // Sub-headline
      tl.from(
        subRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out' },
        '-=0.5'
      );

      // Action buttons
      tl.from(
        actionsRef.current,
        { y: 20, opacity: 0, duration: 0.6, ease: 'expo.out' },
        '-=0.35'
      );

      // Handwritten annotation — "writes" in
      tl.to(
        annotationRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        '-=0.2'
      );

      // Visual — slides in from right
      tl.from(
        visualRef.current,
        { x: 60, opacity: 0, duration: 1, ease: 'expo.out' },
        0.5
      );

      /* ─── "forget" memory pulse ─── 
         After the headline reveals, the word "forget" gently 
         pulses its opacity. This is NOT decorative — it's the 
         product concept manifested in motion.                    */
      const forgetEl = headline.querySelector('.hero-forget');
      if (forgetEl) {
        tl.to(
          forgetEl,
          {
            opacity: 0.55,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          },
          '+=0.3'
        );
      }

      /* ─── Scroll-driven parallax ─── */
      gsap.to(headline, {
        y: -60,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(visualRef.current, {
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      {/* Three.js organic gradient — replaces the flat accent block */}
      <MeshGradient />

      <div className="container hero__inner">
        <div className="hero__content">

          <h1 ref={headlineRef} className="hero__headline">
            <span className="word">
              <span className="word-inner">Students</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner">understand.</span>
            </span>
            <br />
            <span className="word">
              <span className="word-inner">Then</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner">they</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner hero-forget serif">forget.</span>
            </span>
          </h1>
          <p ref={subRef} className="hero__sub">
            A simple post-class revision system that strengthens student recall
            without extra teaching.
          </p>
          <div ref={actionsRef} className="hero__actions">
            <button className="btn btn--violet">Get early access</button>
            <button className="btn btn--outline">See how it works</button>
          </div>
          <div
            ref={annotationRef}
            className="annotation hero__annotation"
            style={{ transform: 'translateY(10px) rotate(-2deg)' }}
          >
            &ldquo;and no one tracks it.&rdquo;
          </div>
        </div>

        <div ref={visualRef} className="hero__visual">
          <div className="img-ph img-ph--violet hero__image-main">
            <span>
              Hero image: student reviewing on tablet, classroom setting
            </span>
          </div>
          <div className="img-ph img-ph--coral hero__image-float">
            <span>Floating card: memory retention chart</span>
          </div>
        </div>
      </div>

      {/* Day column — the forgetting timeline */}
      <div className="hero__sidebar">
        <div className="hero__day">Day 1: 100%</div>
        <div className="hero__day">Day 7: 40%</div>
        <div className="hero__day">Day 21: 15%</div>
        <div className="hero__day">Day 45: 5%</div>
      </div>
    </section>
  );
}
