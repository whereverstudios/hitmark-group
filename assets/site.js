/* Hitmark Group — shared behaviour (no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav: solid after scroll, burger menu */
  const nav = $('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
    const burger = $('.burger', nav);
    if (burger) burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); document.body.style.overflow = ''; }));
  }

  /* marquee: duplicate the track so the loop is seamless */
  $$('.marquee .track').forEach(t => { t.innerHTML += t.innerHTML; });

  /* reveal on scroll */
  const rv = $$('.rv');
  if (rv.length) {
    if (reduce || !('IntersectionObserver' in window)) rv.forEach(el => el.classList.add('in'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      rv.forEach(el => io.observe(el));
    }
  }

  /* counters */
  const counters = $$('[data-count]');
  if (counters.length) {
    const run = el => {
      const end = parseFloat(el.dataset.count), dur = 1400, t0 = performance.now();
      const fmt = v => (el.dataset.decimals ? v.toFixed(el.dataset.decimals) : Math.round(v).toLocaleString());
      if (reduce) { el.textContent = fmt(end); return; }
      const tick = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(end * e); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .4 });
    counters.forEach(el => io.observe(el));
  }

  /* lightbox for YouTube reels */
  const yt = $$('[data-yt]');
  if (yt.length) {
    let box = $('.lightbox');
    if (!box) {
      box = document.createElement('div');
      box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Video player');
      box.innerHTML = '<button class="close" aria-label="Close video">&times;</button><div class="frame"></div><p class="title mono"></p>';
      document.body.appendChild(box);
    }
    const frame = $('.frame', box), title = $('.title', box);
    let last = null;
    const close = () => { box.classList.remove('on'); frame.innerHTML = ''; document.body.style.overflow = ''; if (last) last.focus(); };
    const open = (id, start, label, src) => {
      last = src;
      const s = start ? `&start=${start}` : '';
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1${s}" title="${label || 'Video'}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      title.textContent = label || '';
      box.classList.add('on'); document.body.style.overflow = 'hidden';
      $('.close', box).focus();
    };
    yt.forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(el.dataset.yt, el.dataset.start, el.dataset.title || el.getAttribute('aria-label'), el); }));
    $('.close', box).addEventListener('click', close);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('on')) close(); });
  }

  /* "load more" for hidden reels */
  const more = $('[data-more]');
  if (more) more.addEventListener('click', () => {
    $$(more.dataset.more).forEach((el, i) => { el.classList.remove('hidden'); el.classList.add('rv'); setTimeout(() => el.classList.add('in'), 40 * i); });
    more.closest('.reels-more').remove();
  });

  /* forms: mode switch + mailto composer */
  $$('form[data-mail]').forEach(form => {
    const seg = $('.seg', form.closest('section') || document);
    const setMode = m => {
      form.classList.remove('mode-production', 'mode-charter'); form.classList.add('mode-' + m);
      form.dataset.modeActive = m;
      if (seg) $$('button', seg).forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
      $$('[data-mode]', form).forEach(g => $$('input,select,textarea', g).forEach(i => { i.disabled = g.dataset.mode !== m; }));
    };
    if (seg) $$('button', seg).forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
    const param = new URLSearchParams(location.search).get('mode');
    setMode(param === 'charter' || param === 'production' ? param : (form.dataset.modeDefault || 'production'));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form); const mode = form.dataset.modeActive;
      const lines = [];
      for (const [k, v] of fd.entries()) { if (String(v).trim()) lines.push(`${k.replace(/_/g, ' ')}: ${v}`); }
      const subject = mode === 'charter'
        ? `Charter quote — ${fd.get('from') || '?'} → ${fd.get('to') || '?'} (${fd.get('date') || 'date TBD'})`
        : `Production brief — ${fd.get('project') || fd.get('company') || fd.get('name') || 'new project'}`;
      const body = `${mode === 'charter' ? 'Charter quote request' : 'Production brief'} from hitmarkgroup.com\n\n${lines.join('\n')}\n`;
      location.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const ok = $('.sent', form); if (ok) { ok.hidden = false; }
    });
  });

  /* landing gate */
  const gate = $('.gate');
  if (gate) {
    const ready = () => requestAnimationFrame(() => gate.classList.add('ready'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else setTimeout(ready, 200);
    setTimeout(ready, 1200); // belt and braces
    if (!reduce && matchMedia('(pointer:fine)').matches) {
      $$('.door', gate).forEach(door => {
        const img = $('.img', door);
        door.addEventListener('mousemove', e => {
          const r = door.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          img.style.backgroundPosition = `${50 + x * 4}% ${50 + y * 4}%`;
        });
        door.addEventListener('mouseleave', () => { img.style.backgroundPosition = ''; });
      });
    }
    /* keyboard: left/right arrows pick a side */
    addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') $('.door.left', gate).focus();
      if (e.key === 'ArrowRight') $('.door.right', gate).focus();
    });
  }

  /* year */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
