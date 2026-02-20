'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhoItsFor — Stacked cards that lift on scroll.
   
   All cards sit on top of each other. As the user scrolls,
   the top card lifts away to reveal the next one beneath.
   ────────────────────────────────────────────────────────── */

export default function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    if (!section || !stack) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      const totalCards = cards.length;

      // Create a master timeline tied to scroll
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(totalCards - 1) * 100}%`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      });

      // Each card lifts away in sequence
      cards.forEach((card, i) => {
        if (i < totalCards - 1) {
          masterTl.to(card, {
            yPercent: -100,
            opacity: 0,
            scale: 0.95,
            ease: 'none',
            duration: 1,
          }, i); // Start at position i in the timeline
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const personas = [
    {
      label: 'Schools',
      labelColor: 'yellow',
      title: 'K-12 schools that care about retention',
      desc: 'Your teachers already teach well. Wivme makes sure that learning sticks beyond the classroom door.',
      imgLabel: 'School building or classroom environment',
    },
    {
      label: 'Teachers',
      labelColor: 'purple',
      title: "Teachers who don't want more work",
      desc: 'Zero extra preparation. Wivme generates revision prompts automatically from your existing curriculum.',
      imgLabel: 'Teacher reviewing dashboard',
    },
    {
      label: 'Students',
      labelColor: 'yellow',
      title: 'Students who want to actually remember',
      desc: "10 minutes a day. That's all it takes. Short, targeted prompts that fit between classes.",
      imgLabel: 'Student on phone reviewing prompt',
    },
  ];

  return (
    <section ref={sectionRef} className="who-its-for" id="who">
      <div className="container">
        <div className="who-its-for__label">
          <span className="who-its-for__dot" />
          <span className="who-its-for__dot" />
          Built for
        </div>
        <h2 className="who-its-for__headline">
          Everyone in the
          <br />
          learning chain.
        </h2>
        <div ref={stackRef} className="who-its-for__stack">
          {personas.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`who-its-for__card who-its-for__card--${p.labelColor}`}
              style={{ zIndex: personas.length - i }}
            >
              <div className="who-its-for__card-inner">
                <div className="img-ph who-its-for__card-image">
                  <span>{p.imgLabel}</span>
                </div>
                <div className="who-its-for__card-content">
                  <div
                    className={`who-its-for__card-label who-its-for__card-label--${p.labelColor}`}
                  >
                    {p.label}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
