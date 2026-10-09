/* ===== OCTA — edit links here ===== */
const CONFIG = {
  GYM_SIMULATOR_URL: 'https://apl-gym-license.iyaddahmoune771.workers.dev/demo',
  INSTAGRAM_URL: 'https://www.instagram.com/oocta_m/',
  WHATSAPP_URL: 'https://wa.me/213656038866',
  YOUTUBE_URL: 'YOUTUBE_URL', // paste your channel link
  PHONE_NUMBER: '+213656038866'
};
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const conn = navigator.connection || {};
  const lite = matchMedia('(prefers-reduced-motion: reduce)').matches || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  document.documentElement.classList.add('js');
  if (lite) document.documentElement.classList.add('lite');

  // links: config wins; an unset placeholder stays inert
  $$('[data-link]').forEach(a => {
    const k = a.dataset.link, v = CONFIG[k];
    if (v && v !== k) a.href = v;
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.title = 'Set ' + k + ' in script.js'; }
  });
  $$('[data-tel]').forEach(a => {
    a.href = 'tel:' + CONFIG.PHONE_NUMBER.replace(/[^\d+]/g, ''); const s = $('span', a); if (s) s.textContent = CONFIG.PHONE_NUMBER;
  });

  // quick intro: logo fades in, then the site (~1.1s first visit, ~0.3s after)
  const pl = $('#preloader'), t0 = performance.now(); let done = false, seen = false;
  try { seen = sessionStorage.getItem('octa-seen'); } catch (e) {}
  const finish = () => {
    if (done) return; done = true;
    pl.classList.add('out'); document.body.classList.remove('loading');
    try { sessionStorage.setItem('octa-seen', '1'); } catch (e) {}
    setTimeout(() => pl.remove(), 500); start();
  };
  const min = lite ? 0 : seen ? 300 : 1100;
  const ready = () => setTimeout(finish, Math.max(0, min - (performance.now() - t0)));
  document.readyState === 'complete' ? ready() : addEventListener('load', ready);
  setTimeout(finish, 2500);

  function start() {
    const els = $$('.rv');
    if (!('IntersectionObserver' in window)) return els.forEach(e => e.classList.add('in'));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(el => io.observe(el));
    const links = $$('.links a'), secs = links.map(a => $(a.getAttribute('href')));
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach((a, i) => a.classList.toggle('act', secs[i] === e.target)); }), { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => s && so.observe(s));
    const m = $('#morph'); let t, st = 0;
    new IntersectionObserver(([e]) => {
      clearInterval(t);
      if (lite) m.dataset.stage = 3; else if (e.isIntersecting) t = setInterval(() => m.dataset.stage = st = (st + 1) % 4, 2200);
    }).observe(m);
  }

  // mobile menu
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const toggle = o => {
    menu.classList.toggle('open', o); nav.classList.toggle('menu-open', o);
    burger.setAttribute('aria-expanded', o); menu.setAttribute('aria-hidden', !o);
    document.body.style.overflow = o ? 'hidden' : '';
  };
  burger.onclick = () => toggle(!menu.classList.contains('open'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));

  // scroll: one rAF-throttled handler; the MacBook grows only while visible
  const big = $('.mac.big'), show = $('#show'), slides = $$('.slides img'), dots = $$('#dots i'), cap = $('#cap');
  let cur = 0, tick = false, bigOn = false;
  if (big && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => bigOn = e.isIntersecting, { rootMargin: '120px' }).observe(big);
  const frame = () => {
    tick = false; const vh = innerHeight;
    nav.classList.toggle('scrolled', scrollY > 30);
    if (!lite && bigOn) { const p = clamp((vh - big.getBoundingClientRect().top) / (vh * .85), 0, 1); big.style.transform = `scale(${(.88 + .12 * p).toFixed(3)})`; }
    if (show) {
      const r = show.getBoundingClientRect(), i = Math.floor(clamp(-r.top / (r.height - vh), 0, .999) * slides.length);
      if (i !== cur) { slides[cur].classList.remove('on'); dots[cur].classList.remove('on'); slides[i].classList.add('on'); dots[i].classList.add('on'); cap.textContent = slides[i].dataset.n; cur = i; }
    }
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', () => requestAnimationFrame(frame));
  frame();

  // laptops open once when they scroll into view
  const macs = $$('.mac');
  if (lite || !('IntersectionObserver' in window)) macs.forEach(m => m.classList.add('open'));
  else { const mo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('open'); mo.unobserve(e.target); } }), { threshold: .4 }); macs.forEach(m => mo.observe(m)); }
  document.addEventListener('dragstart', e => e.preventDefault());

  // Q1 modal (the large diagram is downloaded only when opened)
  const dlg = $('#q1dlg'), di = $('img', dlg);
  $('#q1open').onclick = () => { if (!di.getAttribute('src')) di.src = di.dataset.src; dlg.showModal(); };
  $('#q1close').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();
