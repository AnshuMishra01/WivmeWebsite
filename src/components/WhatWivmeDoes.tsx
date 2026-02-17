'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhatWivmeDoes — Feature explanation with creative motion.
   
   Creative choices:
   1. Feature cards enter with back.out easing — they 
      overshoot slightly and settle, as if they have physical 
      mass. Not the standard fade-up.
   2. Big typographic words use clip-path reveal from left — 
      the word "cuts" into existence. Architecture, not fade.
   3. Variable font weight animation on scroll (Inter supports 
      weight 100–900). "Recall" gains visual mass as it 
      scrolls into the viewport center — the word literally 
      gets heavier. This is a creative use of variable fonts + 
      GSAP that most sites never do.
   4. Different typographic treatment per word creates the 
      "structured rebellion" from the design doc.
   ────────────────────────────────────────────────────────── */

export default function WhatWivmeDoes() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ─── Feature cards: back.out overshoot entrance ─── */
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
          delay: i * 0.12,
        });
      });

      /* ─── Big words: clip-path reveal + font weight morph ─── */
      const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
      words.forEach((word, i) => {
        /* Clip-path reveal — word carves into existence from left */
        gsap.fromTo(
          word,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 85%',
              once: true,
            },
            delay: i * 0.18,
          }
        );

        /* Variable font weight animation on scroll.
           Inter is a variable font — its weight can be smoothly 
           interpolated from 100 to 900 by GSAP. As the word 
           passes through the viewport, it gains visual mass.
           
           Skip for serif (Instrument Serif isn't variable) and 
           outline (uses text-stroke, not weight).              */
        if (word.classList.contains('what-we-do__word--bold')) {
          gsap.fromTo(
            word,
            { fontWeight: 100 },
            {
              fontWeight: 900,
              ease: 'none',
              scrollTrigger: {
                trigger: word,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 1,
              },
            }
          );
        }

        /* Serif word: subtle rotation settle */
        if (word.classList.contains('what-we-do__word--serif')) {
          gsap.fromTo(
            word,
            { rotateZ: -1.5 },
            {
              rotateZ: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: word,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 1,
              },
            }
          );
        }

        /* Outline word: letter-spacing animation (tight → wide) */
        if (word.classList.contains('what-we-do__word--outline')) {
          gsap.fromTo(
            word,
            { letterSpacing: '-0.06em' },
            {
              letterSpacing: '0.04em',
              ease: 'none',
              scrollTrigger: {
                trigger: word,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: 1,
              },
            }
          );
        }
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      num: '01',
      title: 'Micro-revision prompts',
      desc: 'Short, targeted recall questions delivered at scientifically-timed intervals after each class.',
      color: 'violet',
      imgLabel: 'Student receiving a micro-revision prompt on phone',
    },
    {
      num: '02',
      title: 'Spaced repetition engine',
      desc: 'Built on cognitive science. Each question surfaces at the exact moment a student is about to forget.',
      color: 'coral',
      imgLabel: 'Spaced repetition schedule visualization',
    },
    {
      num: '03',
      title: 'Silent teacher dashboard',
      desc: "Teachers see class-wide memory gaps without running a single extra test. No extra workload.",
      color: 'sage',
      imgLabel: 'Teacher dashboard showing class retention data',
    },
  ];

  return (
    <section ref={sectionRef} className="what-we-do" id="how">
      <div className="container">
        <div className="what-we-do__top">
          <div>
            <div
              className="label label--violet"
              style={{ marginBottom: 'var(--s-sm)' }}
            >
              How it works
            </div>
            <h2 className="what-we-do__headline">
              One system.
              <br />
              Three <span className="serif">quiet</span> powers.
            </h2>
          </div>
          <div>
            <p className="what-we-do__body">
              Wivme plugs into the gap between understanding and remembering. No
              new curriculum. No class time lost. Just a layer of intelligent
              revision that runs in the background, catching what teachers
              can&apos;t track manually.
            </p>
            <div
              className="img-ph img-ph--cream what-we-do__right-image"
              style={{ marginTop: 'var(--s-md)' }}
            >
              <span>
                Product overview: how Wivme fits into the learning flow
              </span>
            </div>
          </div>
        </div>

        <div className="what-we-do__features">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={`what-we-do__card what-we-do__card--${f.color}`}
            >
              <div className="what-we-do__card-num">{f.num}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div
                className={`img-ph img-ph--${f.color} what-we-do__card-image`}
              >
                <span>{f.imgLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Big typographic words — structured rebellion from Plan.md:
            Same size, same alignment, but each word gets a completely 
            different typographic treatment.                            */}
        <div className="what-we-do__words-wrap">
          <span
            ref={(el) => {
              wordsRef.current[0] = el;
            }}
            className="what-we-do__word what-we-do__word--bold"
          >
            Recall
          </span>
          <br />
          <span
            ref={(el) => {
              wordsRef.current[1] = el;
            }}
            className="what-we-do__word what-we-do__word--serif"
          >
            Reinforce
          </span>
          <br />
          <span
            ref={(el) => {
              wordsRef.current[2] = el;
            }}
            className="what-we-do__word what-we-do__word--outline"
          >
            Measure
          </span>
        </div>
      </div>
    </section>
  );
}
