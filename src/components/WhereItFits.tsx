'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhereItFits — Flow diagram with SVG path drawing.
   
   Creative choices:
   1. SVG arrow paths draw themselves as the section enters 
      the viewport, using GSAP to animate strokeDashoffset. 
      This is a Paper.js-precision concept executed with 
      SVG + GSAP — the connections between steps feel like 
      they're being drawn by hand in real-time.
   2. Steps enter with back.out overshoot — physical momentum.
   3. The sage-green background creates warmth and variety in 
      the page's color rhythm.
   ────────────────────────────────────────────────────────── */

export default function WhereItFits() {
  const sectionRef = useRef<HTMLElement>(null);
  const arrowsRef = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ─── SVG path drawing ─── */
      const paths = arrowsRef.current.filter(Boolean) as SVGPathElement[];
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
          delay: 0.3 + i * 0.4,
        });
      });

      /* ─── Steps entrance ─── */
      gsap.from('.where-it-fits__step', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'back.out(1.3)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.where-it-fits__flow',
          start: 'top 80%',
          once: true,
        },
      });

      /* ─── Tagline entrance ─── */
      gsap.from('.where-it-fits__tagline', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.where-it-fits__tagline',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="where-it-fits">
      <div className="container">
        <div className="where-it-fits__label">
          <div className="label label--sage">Where Wivme fits</div>
        </div>

        <div className="where-it-fits__flow">
          <div className="where-it-fits__step">Class</div>

          {/* SVG arrow — draws itself on scroll */}
          <svg
            width="80"
            height="24"
            viewBox="0 0 80 24"
            fill="none"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <path
              ref={(el) => {
                arrowsRef.current[0] = el;
              }}
              d="M2 12 L68 12 L58 4 M68 12 L58 20"
              stroke="var(--c-sage)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="where-it-fits__step where-it-fits__step--highlight">
            Wivme
          </div>

          {/* SVG arrow — draws itself on scroll */}
          <svg
            width="80"
            height="24"
            viewBox="0 0 80 24"
            fill="none"
            style={{ flexShrink: 0 }}
            aria-hidden="true"
          >
            <path
              ref={(el) => {
                arrowsRef.current[1] = el;
              }}
              d="M2 12 L68 12 L58 4 M68 12 L58 20"
              stroke="var(--c-sage)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="where-it-fits__step">Exam</div>
        </div>

        <p className="where-it-fits__tagline">
          Between the lesson and the test,{' '}
          <span className="serif">Wivme works in silence.</span>
        </p>

        <div className="img-ph img-ph--sage where-it-fits__image">
          <span>
            Timeline diagram showing Wivme&apos;s position in the learning
            workflow
          </span>
        </div>
      </div>
    </section>
  );
}
