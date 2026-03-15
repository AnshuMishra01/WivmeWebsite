'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import heroImage from '@/Images/Hero.png';

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
  const recallRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
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
        duration: 0.95,
        ease: 'expo.out',
        stagger: 0.07,
      });

      // Recall panel
      tl.from(
        recallRef.current,
        { x: -30, opacity: 0, duration: 0.7, ease: 'expo.out' },
        '-=0.45'
      );

      // Visual
      tl.from(
        visualRef.current,
        { y: 20, opacity: 0, duration: 0.85, ease: 'expo.out' },
        '-=0.4'
      );

      // Value proposition block
      tl.from(
        contentRef.current,
        { x: 28, opacity: 0, duration: 0.7, ease: 'expo.out' },
        '-=0.45'
      );

      // Subtle scroll depth for a serious parallax feel
      gsap.to(headlineRef.current, {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      gsap.to(visualRef.current, {
        y: 26,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div className="hero__inner">
        <h1 ref={headlineRef} className="hero__headline">
          <span className="word">
            <span className="word-inner">Own</span>
          </span>{' '}
          <span className="word">
            <span className="word-inner">what</span>
          </span>{' '}
          <span className="word">
            <span className="word-inner">you</span>
          </span>{' '}
          <span className="word">
            <span className="word-inner hero__learn">learn.</span>
          </span>
        </h1>

        <div className="hero__grid">
          <div ref={recallRef} className="hero__recall">
            <div className="hero__recall-top">50+</div>
            <div className="hero__recall-label">Day 1 to Day 45 recall</div>
            <div className="hero__days">
              <div className="hero__day">Day 1: 100%</div>
              <div className="hero__day">Day 7: 40%</div>
              <div className="hero__day">Day 21: 15%</div>
              <div className="hero__day">Day 45: 5%</div>
            </div>
          </div>

          <div ref={visualRef} className="hero__visual">
            <Image
              src={heroImage}
              alt="3D student with floating robot"
              className="hero__image-main"
              priority
            />
          </div>

          <div ref={contentRef} className="hero__content">
            <p ref={subRef} className="hero__sub">
              For the first time in decades, schools can ensure what&apos;s taught
              in class is actually remembered.
            </p>
            <div ref={actionsRef} className="hero__actions">
              <button className="btn btn--violet">Get early access</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
