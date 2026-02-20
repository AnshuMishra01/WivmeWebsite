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
          y: 300,
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

      /* ─── Big words: scroll-driven sideways movement ─── */
      const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
      words.forEach((word, i) => {
        const isThirdCard = i === 2;
        
        /* Set initial centered position */
        gsap.set(word, { xPercent: -50 });
        
        /* Fade in the word */
        gsap.fromTo(
          word,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 95%',
              once: true,
            },
            delay: i * 0.05,
          }
        );

        /* Sideways movement on scroll - cards 1&2 right to left, card 3 left to right */
        gsap.to(word, {
          x: isThirdCard ? 400 : -400,
          ease: 'none',
          scrollTrigger: {
            trigger: word,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 0.5,
          },
        });

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
                start: 'top 95%',
                end: 'top 60%',
                scrub: 0.5,
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
                start: 'top 95%',
                end: 'top 60%',
                scrub: 0.5,
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
                start: 'top 95%',
                end: 'top 60%',
                scrub: 0.5,
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
      word: 'Recall',
      wordStyle: 'bold',
    },
    {
      num: '02',
      title: 'Spaced repetition engine',
      desc: 'Built on cognitive science. Each question surfaces at the exact moment a student is about to forget.',
      color: 'violet',
      imgLabel: 'Spaced repetition schedule visualization',
      word: 'Reinforce',
      wordStyle: 'serif',
    },
    {
      num: '03',
      title: 'Silent teacher dashboard',
      desc: "Teachers see class-wide memory gaps without running a single extra test. No extra workload.",
      color: 'butter',
      imgLabel: 'Teacher dashboard showing class retention data',
      word: 'Measure',
      wordStyle: 'outline',
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
              className="what-we-do__card-wrapper"
            >
              {/* Big word behind the card */}
              <span
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className={`what-we-do__card-word what-we-do__word--${f.wordStyle}`}
              >
                {f.word}
              </span>
              
              {/* Card on top */}
              <div
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
