/* Photo orbit on every page load. Never waits on remote images. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const images = [
    '1512553353614-82a7370096dc', '1537956965359-7573183d1f57',
    '1508009603885-50cf7c579365', '1442512595331-e89e73853f31',
    '1537956965359-7573183d1f57', '1512553353614-82a7370096dc',
    '1442512595331-e89e73853f31', '1508009603885-50cf7c579365',
    '1512553353614-82a7370096dc', '1537956965359-7573183d1f57'
  ];
  const overlay = document.createElement('div');
  overlay.className = 'travel-intro';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'ภาพท่องเที่ยวเปิดเว็บไซต์');
  const orbit = document.createElement('div');
  orbit.className = 'intro-orbit';
  orbit.setAttribute('aria-hidden', 'true');
  const photoLoads = [];
  images.forEach((id, index) => {
    const slot = document.createElement('div');
    slot.className = 'intro-photo-slot';
    slot.style.setProperty('--angle', `${index * 36}deg`);
    slot.style.setProperty('--tilt', `${[12,-15,9,-8,16,-12,8,-16,11,-9][index]}deg`);
    const photo = document.createElement('img');
    photo.alt = '';
    photo.decoding = 'async';
    photoLoads.push(new Promise(resolve => {
      photo.onload = async () => { try { await photo.decode(); } catch {} resolve(); };
      photo.onerror = () => { photo.hidden = true; resolve(); };
    }));
    photo.src = `https://images.unsplash.com/photo-${id}?w=240&q=75`;
    photo.style.objectPosition = index > 3 ? '70% 35%' : 'center';
    // Missing images retain a pleasant local travel illustration.
    slot.append(photo); orbit.append(slot);
  });
  const center = document.createElement('div');
  center.className = 'intro-center';
  center.innerHTML = '<span>เที่ยวไหนดี<span class="intro-dot">●</span></span><small>YOUR NEXT STORY AWAITS</small>';
  const skip = document.createElement('button');
  skip.className = 'intro-skip'; skip.type = 'button'; skip.textContent = 'ข้ามอินโทร ↗';
  const note = document.createElement('p'); note.className = 'intro-note'; note.textContent = 'ทุกการเดินทาง เริ่มด้วยความอยากไป';
  overlay.append(orbit, center, note, skip);
  document.body.append(overlay);
  document.documentElement.classList.add('intro-active');
  // Reveal decoded photos together. Slow images keep the fallback for this intro.
  Promise.race([Promise.all(photoLoads), new Promise(resolve => setTimeout(resolve, 1000))]).then(() => {
    orbit.querySelectorAll('img').forEach(photo => {
      if (photo.complete && photo.naturalWidth) photo.classList.add('intro-photo-ready');
    });
  });
  const previousFocus = document.activeElement;
  const inertElements = new Map();
  function disableBackground() {
    [...document.body.children].forEach(element => {
      if (element === overlay || ['SCRIPT','STYLE','LINK'].includes(element.tagName) || inertElements.has(element)) return;
      inertElements.set(element, element.inert); element.inert = true;
    });
  }
  const observer = new MutationObserver(disableBackground);
  observer.observe(document.body, {childList:true});
  disableBackground(); skip.focus({preventScroll:true});
  let finished = false;
  function finish() {
    if (finished) return;
    finished = true; clearTimeout(timer); observer.disconnect();
    reduced.removeEventListener('change', onPreference);
    document.removeEventListener('keydown', onKey);
    overlay.classList.add('intro-leaving');
    setTimeout(() => {
      inertElements.forEach((value, element) => { element.inert = value; });
      overlay.remove(); document.documentElement.classList.remove('intro-active');
      const target = previousFocus !== document.body && previousFocus?.isConnected ? previousFocus : document.querySelector('.header .brand');
      target?.focus({preventScroll:true});
    }, reduced.matches ? 0 : 550);
  }
  function onPreference() { if (reduced.matches) finish(); }
  function onKey(event) {
    if (event.key === 'Escape') finish();
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  }
  skip.onclick = finish;
  document.addEventListener('keydown', onKey);
  reduced.addEventListener('change', onPreference);
  const timer = setTimeout(finish, 3200);
})();
