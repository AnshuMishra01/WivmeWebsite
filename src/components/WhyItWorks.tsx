'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* ──────────────────────────────────────────────────────────
   WhyItWorks — Authority section with animated stats.
   
   Creative choices:
   1. Stats use count-up animation via GSAP proxy objects —
      numbers tick from 0 to their final value as they enter 
      the viewport. This creates a sense of data materializing.
   2. Each stat sits on a colored background (violet, coral, 
      sage, amber) creating visual density and color richness 
      without being decorative — the color distinguishes the 
      metric category.
   3. Restrained animation per Plan.md section 9 — this is 
      the trust section. Motion slows down. Typography becomes 
      more restrained. No script font.
   ────────────────────────────────────────────────────────── */

interface StatData {
  value: number;
  suffix: string;
  label: string;
  color: string;
  display: string;
}

export default function WhyItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ─── Count-up animation for stats ─── */
      const statEls = statsRef.current.filter(Boolean) as HTMLDivElement[];

      statEls.forEach((statEl, i) => {
        const numEl = statEl.querySelector(
          '.why-it-works__stat-number'
        ) as HTMLDivElement | null;
        if (!numEl) return;

        const data = stats[i];
        if (!data || data.value === 0) return; // Skip "0" — it's emphatic, not animated

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: data.value,
          duration: 1.8,
          ease: 'power2.out',
          snap: { val: 1 },
          scrollTrigger: {
            trigger: statEl,
            start: 'top 82%',
            once: true,
          },
          onUpdate: () => {
            numEl.textContent = Math.round(proxy.val) + data.suffix;
          },
        });
      });

      /* ─── Section entrance — subtle, restrained ─── */
      gsap.from('.why-it-works__headline', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const stats: StatData[] = [
    {
      value: 87,
      suffix: '%',
      display: '0%',
      label: 'Average retention improvement after 30 days',
      color: 'violet',
    },
    {
      value: 10,
      suffix: '',
      display: '0',
      label: "Minutes per day. That's all students need.",
      color: 'coral',
    },
    {
      value: 3,
      suffix: 'x',
      display: '0x',
      label: 'Better test performance vs. re-reading notes',
      color: 'sage',
    },
    {
      value: 0,
      suffix: '',
      display: '0',
      label: 'Extra hours of teacher preparation required',
      color: 'amber',
    },
  ];

  return (
    <section ref={sectionRef} className="why-it-works" id="why">
      <div className="container">
        <div className="why-it-works__inner">
          <div>
            <div
              className="label label--sage"
              style={{ marginBottom: 'var(--s-sm)' }}
            >
              The evidence
            </div>
            <h2 className="why-it-works__headline">
              Built on science,
              <br />
              not <span className="serif">promises.</span>
            </h2>
            <p className="why-it-works__body">
              Spaced repetition isn&apos;t new. It&apos;s one of the most well-documented
              findings in cognitive psychology. Wivme just makes it effortless to
              deploy at school scale.
            </p>
            <p className="why-it-works__body">
              Every prompt is timed to hit the exact moment a student is about to
              forget. That&apos;s not a feature. That&apos;s 40 years of memory research
              working behind the scenes.
            </p>
            <div
              className="img-ph img-ph--cream why-it-works__image"
              style={{ marginTop: 'var(--s-md)' }}
            >
              <span>
                Research diagram: Ebbinghaus forgetting curve with Wivme
                intervention points
              </span>
            </div>
          </div>

          <div>
            <div className="why-it-works__stats">
              {stats.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    statsRef.current[i] = el;
                  }}
                  className={`why-it-works__stat why-it-works__stat--${s.color}`}
                >
                  <div className="why-it-works__stat-number">{s.display}</div>
                  <div className="why-it-works__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="why-it-works__footnote">
              Based on meta-analyses of spaced repetition studies (Cepeda et al.,
              2006; Karpicke &amp; Blunt, 2011) and internal pilot data from 3
              schools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
