'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhereItFits — Crack effect splitting animation.
   
   Class and Exam cards start together, then split apart
   as the user scrolls. Wivme emerges from the crack
   between them.
   ────────────────────────────────────────────────────────── */

export default function WhereItFits() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const classCardRef = useRef<HTMLDivElement>(null);
  const examCardRef = useRef<HTMLDivElement>(null);
  const wivmeCardRef = useRef<HTMLDivElement>(null);
  const crackRef = useRef<HTMLDivElement>(null);
  const arrow1Ref = useRef<SVGPathElement>(null);
  const arrow2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 50%',
          end: 'top 15%',
          scrub: 1,
        },
      });

      // Class card moves left
      tl.to(classCardRef.current, {
        x: -100,
        ease: 'power2.out',
      }, 0);

      // Exam card moves right
      tl.to(examCardRef.current, {
        x: 100,
        ease: 'power2.out',
      }, 0);

      // Crack opens
      tl.to(crackRef.current, {
        width: 200,
        opacity: 1,
        ease: 'power2.out',
      }, 0);

      // Wivme emerges from the crack
      tl.fromTo(wivmeCardRef.current, 
        { scale: 0.5, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, ease: 'back.out(1.4)' },
        0.2
      );

      // Animate curved arrows - draw them on scroll
      [arrow1Ref.current, arrow2Ref.current].forEach((path) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        tl.to(path, {
          strokeDashoffset: 0,
          ease: 'power2.out',
        }, 0.3);
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="where-it-fits">
      <div className="container">
        <div className="where-it-fits__label">
          <div className="label label--purple">Where Wivme fits</div>
        </div>

        <div ref={containerRef} className="where-it-fits__flow">
          {/* Curved arrows on top - hidden initially, draw on scroll */}
          <div className="where-it-fits__arrows">
            <svg className="where-it-fits__curved-arrow where-it-fits__curved-arrow--left" width="120" height="50" viewBox="0 0 120 50" fill="none">
              <path 
                ref={arrow1Ref}
                d="M10 40 Q 60 0, 110 40" 
                stroke="var(--c-violet)" 
                strokeWidth="2" 
                strokeLinecap="round"
                fill="none"
              />
              <path d="M105 35 L110 40 L103 43" stroke="var(--c-violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <svg className="where-it-fits__curved-arrow where-it-fits__curved-arrow--right" width="120" height="50" viewBox="0 0 120 50" fill="none">
              <path 
                ref={arrow2Ref}
                d="M10 40 Q 60 0, 110 40" 
                stroke="var(--c-violet)" 
                strokeWidth="2" 
                strokeLinecap="round"
                fill="none"
              />
              <path d="M105 35 L110 40 L103 43" stroke="var(--c-violet)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>

          {/* Class card */}
          <div ref={classCardRef} className="where-it-fits__card where-it-fits__card--white">
            <span className="where-it-fits__card-title">Class</span>
            <span className="where-it-fits__card-sub">Learning happens</span>
          </div>

          {/* Crack / Gap area */}
          <div ref={crackRef} className="where-it-fits__crack">
            {/* Wivme emerges here */}
            <div ref={wivmeCardRef} className="where-it-fits__card where-it-fits__card--purple">
              <span className="where-it-fits__card-title">Wivme</span>
              <span className="where-it-fits__card-sub">Memory sticks</span>
            </div>
          </div>

          {/* Exam card */}
          <div ref={examCardRef} className="where-it-fits__card where-it-fits__card--white">
            <span className="where-it-fits__card-title">Exam</span>
            <span className="where-it-fits__card-sub">Knowledge tested</span>
          </div>
        </div>

        <p className="where-it-fits__tagline">
          Between the lesson and the test,{' '}
          <span className="serif">Wivme fills the gap.</span>
        </p>
      </div>
    </section>
  );
}
