'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

declare global {
  interface Window {
    Calendly: any;
  }
}

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
  const visualRef = useRef<HTMLDivElement>(null);

  const openCalendly = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/anshu-wivmeai/30min?primary_color=bb36f6'
      });
    }
  };

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

      // Visual — slides in from right
      tl.from(
        visualRef.current,
        { x: 60, opacity: 0, duration: 1, ease: 'expo.out' },
        0.5
      );

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

      /* ─── Book bars scroll animation ─── */
      const leftBar = section.querySelector('.hero__book-bar--left');
      const rightBar = section.querySelector('.hero__book-bar--right');

      if (leftBar && rightBar) {
        gsap.fromTo(leftBar, 
          { scaleX: 0 },
          {
            scaleX: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );

        gsap.fromTo(rightBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div className="container hero__inner">
        <div className="hero__panel">
          <div className="hero__grid">
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
                <span className="word-inner serif">learn.</span>
              </span>
            </h1>

            <div className="hero__info">
              <div className="hero__stat-block">
                <div className="hero__stat-number">50+</div>
                <div className="hero__stat-label">Day 1 → Day 45 recall</div>
                <div className="hero__stat-stack">
                  <div className="hero__day">Day 1: 100%</div>
                  <div className="hero__day">Day 7: 40%</div>
                  <div className="hero__day">Day 21: 15%</div>
                  <div className="hero__day">Day 45: 5%</div>
                </div>
              </div>

              <div ref={visualRef} className="hero__visual-center">
                <img 
                  src="/wivme-content/kid listening.png" 
                  alt="Student with headphones learning" 
                  className="hero__kid-image"
                />
              </div>

              <div className="hero__copy">
                <p ref={subRef} className="hero__sub">
                  A simple post-class revision system that strengthens student
                  recall without extra teaching.
                </p>
                <div ref={actionsRef} className="hero__actions">
                  <button className="btn btn--violet" onClick={openCalendly}>Get early access</button>
                  <button className="btn btn--outline">See how it works</button>
                </div>
              </div>
            </div>
          </div>
          <div className="hero__book-bars">
            <div className="hero__book-bar hero__book-bar--left"></div>
            <div className="hero__book-bar hero__book-bar--right"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
