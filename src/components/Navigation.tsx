'use client';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Calendly: any;
  }
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      
      // Detect which section is in view
      const sections = ['hero', 'how', 'who', 'why'];
      const scrollPosition = window.scrollY + 100;
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId) || 
                       (sectionId === 'hero' ? document.querySelector('.hero') : null);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openCalendly = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/anshu-wivmeai/30min?primary_color=bb36f6'
      });
    }
  };

  return (
    <nav className={`nav${scrolled ? ' nav-scrolled' : ''} nav--${currentSection}`}>
      <a href="#" className="nav-logo">
        <img src="/logo.png" alt="Wisme" className="nav-logo-image" />
      </a>
      <div className="nav-links">
        <a href="#how" className="nav-link">How it works</a>
        <a href="#who" className="nav-link">Who it&apos;s for</a>
        <a href="#why" className="nav-link">Why it works</a>
        <button className="nav-cta" onClick={openCalendly}>Get early access</button>
      </div>
    </nav>
  );
}
