'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhoItsFor — Dark authority section with creative touches.
   
   Creative choices:
   1. Mouse-follow radial gradient — a subtle "spotlight" 
      that follows the cursor across the dark surface. This 
      creates an exploratory, tactile feel without being 
      gimmicky. It's done via CSS custom properties updated 
      in JavaScript — no Canvas, no WebGL, just clever CSS.
   2. Clip-path entrance — the entire dark section sweeps 
      in from the left via a GSAP-driven clip-path animation. 
      This creates an architectural transition that feels like 
      the page is being physically constructed.
   3. Cards use back.out overshoot easing — they have 
      physical momentum, as if they've been placed with force 
      and settle into position.
   ────────────────────────────────────────────────────────── */

export default function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* ─── Mouse spotlight ─── */
    const onMouse = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty(
        '--mouse-x',
        `${((e.clientX - rect.left) / rect.width) * 100}%`
      );
      section.style.setProperty(
        '--mouse-y',
        `${((e.clientY - rect.top) / rect.height) * 100}%`
      );
    };
    section.addEventListener('mousemove', onMouse);

    const ctx = gsap.context(() => {
      /* ─── Clip-path section reveal ─── */
      gsap.fromTo(
        section,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true,
          },
        }
      );

      /* ─── Cards with physical momentum ─── */
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            once: true,
          },
          delay: i * 0.15,
        });
      });
    }, section);

    return () => {
      section.removeEventListener('mousemove', onMouse);
      ctx.revert();
    };
  }, []);

  const personas = [
    {
      label: 'Schools',
      labelColor: 'amber',
      title: 'K-12 schools that care about retention',
      desc: 'Your teachers already teach well. Wivme makes sure that learning sticks beyond the classroom door.',
      imgLabel: 'School building or classroom environment',
    },
    {
      label: 'Teachers',
      labelColor: 'violet',
      title: "Teachers who don't want more work",
      desc: 'Zero extra preparation. Wivme generates revision prompts automatically from your existing curriculum.',
      imgLabel: 'Teacher reviewing dashboard',
    },
    {
      label: 'Students',
      labelColor: 'coral',
      title: 'Students who want to actually remember',
      desc: "10 minutes a day. That's all it takes. Short, targeted prompts that fit between classes.",
      imgLabel: 'Student on phone reviewing prompt',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="who-its-for"
      id="who"
      style={{
        background: `
          radial-gradient(
            circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(99, 70, 230, 0.07),
            transparent
          ),
          var(--c-charcoal)
        `,
      }}
    >
      <div className="container">
        <div className="label" style={{ color: 'var(--c-amber)' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--c-amber)',
              display: 'inline-block',
              marginRight: '0.5em',
            }}
          />
          Built for
        </div>
        <h2
          className="who-its-for__headline"
          style={{ marginTop: 'var(--s-sm)' }}
        >
          Everyone in the
          <br />
          learning chain.
        </h2>
        <div className="who-its-for__grid">
          {personas.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="who-its-for__card"
            >
              <div className="img-ph img-ph--dark who-its-for__card-image">
                <span>{p.imgLabel}</span>
              </div>
              <div
                className={`who-its-for__card-label who-its-for__card-label--${p.labelColor}`}
              >
                {p.label}
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
