/* Scroll-driven presentation, independent of trip state and map playback. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 750px)');
  const header = document.querySelector('.header');
  const hero = document.querySelector('.editorial-hero');
  const manifesto = document.querySelector('.manifesto');
  const cards = [...document.querySelectorAll('.travel-card')];
  const sections = [...document.querySelectorAll('#planner, #result, #discover')];
  const navLinks = [...document.querySelectorAll('.header nav a')];
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let frame = 0;
  let observer;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const revealTargets = [...document.querySelectorAll('.manifesto > *, .planner > .section-heading, .fields, .interests, .trip-section > .section-heading, .trip-layout, #discover > .section-heading, .destination')];

  function configureReveals() {
    observer?.disconnect();
    revealTargets.forEach(element => element.classList.remove('reveal-pending'));
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-seen');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -25px 0px' });
    revealTargets.forEach((element, index) => {
      element.classList.add('scroll-reveal');
      element.style.setProperty('--reveal-delay', `${element.classList.contains('destination') ? (index % 3) * 90 : 0}ms`);
      if (element.getBoundingClientRect().top > innerHeight && !element.classList.contains('reveal-seen')) {
        element.classList.add('reveal-pending');
        observer.observe(element);
      }
    });
  }

  function paint() {
    frame = 0;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${maxScroll > 0 ? clamp(y / maxScroll, 0, 1) : 0})`;
    header.classList.toggle('is-scrolled', y > 35);
    let active = '';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight * .45) active = section.id;
    });
    navLinks.forEach(link => {
      const selected = link.hash === `#${active === 'result' ? 'planner' : active}`;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (reduced.matches) {
      cards.forEach(card => { card.style.translate = ''; card.style.rotate = ''; });
      hero.style.removeProperty('--hero-offset');
      manifesto.style.removeProperty('--landscape-scale');
      return;
    }
    const bounds = hero.getBoundingClientRect();
    const distance = clamp(-bounds.top + header.offsetHeight, 0, bounds.height);
    const factor = compact.matches ? .28 : 1;
    cards.forEach((card, i) => {
      const direction = i % 2 === 0 ? -1 : 1;
      card.style.translate = `${direction * distance * .075 * factor}px ${-distance * [ .14, .23, .09, .17 ][i] * factor}px`;
      card.style.rotate = `${direction * distance * .006 * factor}deg`;
    });
    hero.style.setProperty('--hero-offset', `${distance * .08 * factor}px`);
    const exit = clamp(distance / (bounds.height * .8), 0, 1);
    hero.style.setProperty('--hero-fade', String(1 - exit));
    hero.style.setProperty('--hero-blur', `${exit * 7 * factor}px`);
    hero.style.setProperty('--hero-scale', String(1 - exit * .07));
    const sectionProgress = clamp((innerHeight - manifesto.getBoundingClientRect().top) / innerHeight, 0, 1);
    manifesto.style.setProperty('--landscape-scale', String(1 + sectionProgress * .23));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  document.addEventListener('focusin', event => {
    event.target.closest('.reveal-pending')?.classList.remove('reveal-pending');
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', () => { configureReveals(); schedule(); });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  configureReveals();
  schedule();
})();
