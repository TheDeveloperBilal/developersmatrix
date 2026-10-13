'use client';

import { useEffect } from 'react';

/**
 * Draws hero and section eyebrow icons in as they scroll into view.
 * Icons opt in with a data-draw attribute; the strokes are animated with
 * stroke-dashoffset in globals.css. Without JavaScript, or with reduced
 * motion, the icons simply stay drawn.
 */
export default function IconDrawObserver() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const icons = Array.from(document.querySelectorAll<SVGElement>('svg[data-draw]'));
    if (icons.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('draw-armed');
          entry.target.classList.add('draw-in');
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.6 }
    );

    for (const icon of icons) {
      icon.classList.add('draw-armed');
      io.observe(icon);
    }
    return () => io.disconnect();
  }, []);

  return null;
}
