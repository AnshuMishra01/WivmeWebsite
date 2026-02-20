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
                <span className="word-inner serif">forget.</span>
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
                <div className="phone-mockup">
                  <div className="phone-mockup__frame">
                    <div className="phone-mockup__notch"></div>
                    <div className="phone-mockup__screen">
                      <img 
                        src="/hero-character.png" 
                        alt="Wivme mascot character" 
                        className="phone-mockup__image"
                      />
                    </div>
                    <div className="phone-mockup__home-indicator"></div>
                  </div>
                </div>
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
          <div className="hero__wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
