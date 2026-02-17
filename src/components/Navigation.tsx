'use client';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <a href="#" className="nav-logo">
        <span className="nav-logo-text">Wivme</span>
      </a>
      <div className="nav-links">
        <a href="#how" className="nav-link">How it works</a>
        <a href="#who" className="nav-link">Who it&apos;s for</a>
        <a href="#why" className="nav-link">Why it works</a>
        <button className="nav-cta">Get early access</button>
      </div>
    </nav>
  );
}
