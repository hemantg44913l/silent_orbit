import { useEffect } from 'react';

/**
 * Custom React Hook for smooth bidirectional scroll motion:
 * - Elements float in from Left / Right into Center when entering viewport.
 * - Elements float upward smoothly as you scroll past them.
 * - Reversing scroll (scrolling back UP) smoothly re-animates elements back into view.
 */
export function useScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      const windowHeight = window.innerHeight;

      elements.forEach((el) => {
        if (prefersReducedMotion) {
          el.classList.add('revealed');
          return;
        }

        const rect = el.getBoundingClientRect();

        // Inside viewport threshold
        const isVisible = rect.top < windowHeight - 60 && rect.bottom > 40;
        // Scrolled above the viewport (exiting upwards)
        const isScrolledPast = rect.bottom <= 40;

        if (isVisible) {
          el.classList.add('revealed');
          el.classList.remove('scrolled-past');
        } else if (isScrolledPast) {
          el.classList.add('scrolled-past');
          el.classList.remove('revealed');
        } else {
          // Below the viewport (scrolling back up or not reached yet)
          el.classList.remove('revealed');
          el.classList.remove('scrolled-past');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}

/**
 * Helper utility for 3D card tilt & mouse glow tracking on hover
 */
export function handleCardMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
  const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);
  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
}

export function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
}
