/**
 * Fait apparaître doucement les blocs quand ils entrent dans l'écran.
 * Sans IntersectionObserver ou avec « mouvement réduit », tout reste visible.
 */
const SELECTOR = '.section__head, .about__text, .facts, .skills, .case, .others, .timeline-cols > div, .ticket, .contact > *, .diagram';

export function initReveal() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll(SELECTOR);

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => {
    // .diagram n'a pas d'effet d'apparition, seulement l'animation des liaisons.
    if (!el.classList.contains('diagram')) el.classList.add('reveal');
    io.observe(el);
  });
}
