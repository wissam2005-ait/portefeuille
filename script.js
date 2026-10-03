document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Étoiles en fond */
  const cv = document.getElementById('stars'), ctx = cv.getContext('2d');
  let dots = [];
  const sizeCanvas = () => {
    cv.width = innerWidth; cv.height = innerHeight;
    dots = Array.from({ length: Math.min(90, innerWidth / 14) }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 1.4 + .3, v: Math.random() * .25 + .05
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = 'rgba(147,170,255,.55)';
    dots.forEach(d => {
      d.y -= d.v; if (d.y < 0) d.y = cv.height;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.3); ctx.fill();
    });
    if (!reduce) requestAnimationFrame(draw);
  };
  sizeCanvas(); draw(); addEventListener('resize', sizeCanvas);

  /* Effet de frappe */
  const words = ['Développeuse Web Full-Stack', 'Étudiante en Master 1', 'Passionnée de PHP, Java et SQL'];
  const out = document.getElementById('typed');
  let w = 0, i = 0, del = false;
  (function type() {
    const word = words[w];
    if (reduce) { out.textContent = words[0]; return; }
    out.textContent = word.slice(0, i);
    if (!del && i === word.length) { del = true; return setTimeout(type, 1800); }
    if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    i += del ? -1 : 1;
    setTimeout(type, del ? 35 : 75);
  })();

  /* Barre de progression */
  const bar = document.getElementById('progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });

  /* Apparition au scroll */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.card, .timeline li, h2, .text').forEach(el => { el.classList.add('reveal'); io.observe(el); });

  /* Lien actif dans le menu */
  const links = [...document.querySelectorAll('.links a')];
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

  /* Menu mobile */
  const burger = document.querySelector('.burger'), menu = document.querySelector('.links');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

  /* Formulaire : ouvre le mail avec le message pré-rempli (site statique) */
  document.getElementById('form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get('message')}\n\n${f.get('nom')} (${f.get('email')})`;
    location.href = 'mailto:wissam.aitelhadii@gmail.com?subject=' +
      encodeURIComponent('Contact depuis le portfolio : ' + f.get('nom')) + '&body=' + encodeURIComponent(body);
  });

  /* Compteurs animés */
  const count = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.textContent; let v = 0;
    count.unobserve(el);
    if (reduce) return;
    const t = setInterval(() => { v++; el.textContent = v; if (v >= end) clearInterval(t); }, 180);
    el.textContent = 0;
  }), { threshold: .6 });
  document.querySelectorAll('[data-n]').forEach(el => count.observe(el));

  /* Filtres de projets */
  const fs = document.querySelectorAll('.f');
  fs.forEach(b => b.addEventListener('click', () => {
    fs.forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.proj').forEach(p =>
      p.classList.toggle('hide', b.dataset.f !== 'all' && !p.dataset.cat.split(' ').includes(b.dataset.f)));
  }));

  /* Halo qui suit la souris sur les cartes */
  document.addEventListener('mousemove', e => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* Retour en haut */
  const top = document.getElementById('top');
  addEventListener('scroll', () => { top.hidden = scrollY < 600; }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
});