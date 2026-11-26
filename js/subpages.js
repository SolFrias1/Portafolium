/* ==========================================================================
   FUNCIONALIDAD COMPARTIDA PARA ABOUT, WORK INDEX Y FICHAS DE PROYECTO
   ========================================================================== */

(function () {
  /* 1. MENÚ MÓVIL */
  const menuBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawer');

  function setDrawerOpen(open) {
    if (!drawer || !menuBtn) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && closeDrawerBtn) closeDrawerBtn.focus();
    else if (!open) menuBtn.focus();
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => setDrawerOpen(true));
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => setDrawerOpen(false));
    drawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setDrawerOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawerOpen(false);
    });
  }

  /* 2. LIGHTBOX EN GALERÍAS DE SUBPÁGINAS */
  const lightbox = document.getElementById('fullbleedLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const closeLightboxBtn = document.getElementById('closeLightbox');

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '';
    if (lightboxTitle) lightboxTitle.textContent = title || 'Vista ampliada';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeLightboxBtn) closeLightboxBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) closeLightbox();
  });

  document.querySelectorAll('[data-gallery-zoom]').forEach((box) => {
    const img = box.querySelector('img');
    if (!img) return;
    box.addEventListener('click', () => {
      openLightbox(img.getAttribute('src'), box.dataset.galleryCaption || img.getAttribute('alt') || '');
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.getAttribute('src'), box.dataset.galleryCaption || img.getAttribute('alt') || '');
      }
    });
  });

  /* 3. CANVAS PANÓPTICO SI ESTÁ EN DOMESTICADAS O WORK INDEX */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('canvas[data-domesticadas-canvas]').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cols = 10;
    const rows = 6;
    const w = (canvas.width = 640);
    const h = (canvas.height = 400);
    const cw = w / cols;
    const ch = h / rows;

    function draw(t) {
      ctx.fillStyle = '#0B0A09';
      ctx.fillRect(0, 0, w, h);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * cw;
          const y = r * ch;
          const wave = Math.sin(t * 0.002 + c * 0.9 + r * 1.4) * Math.cos(t * 0.0014 - r);
          if (wave > 0.62) {
            ctx.fillStyle = 'rgba(214, 61, 61, 0.42)';
            ctx.fillRect(x + 3, y + 3, cw - 6, ch - 6);
            ctx.strokeStyle = '#D63D3D';
            ctx.strokeRect(x + 3, y + 3, cw - 6, ch - 6);
          } else if (wave > 0.18) {
            ctx.fillStyle = 'rgba(229, 178, 93, 0.25)';
            ctx.fillRect(x + 3, y + 3, cw - 6, ch - 6);
            ctx.strokeStyle = 'rgba(229, 178, 93, 0.65)';
            ctx.strokeRect(x + 3, y + 3, cw - 6, ch - 6);
          } else {
            ctx.strokeStyle = 'rgba(244, 241, 235, 0.1)';
            ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2);
          }
        }
      }
      ctx.fillStyle = '#F4F1EA';
      ctx.font = '12px "IBM Plex Mono", monospace';
      ctx.fillText('corral → ojo / cursor → chisme humano', 18, h - 18);
      if (!prefersReduced) requestAnimationFrame(draw);
    }
    draw(1200);
  });

  /* 4. FILTRO EN WORK/INDEX.HTML */
  const filterBtns = document.querySelectorAll('.work-filter-btn');
  const cards = document.querySelectorAll('.work-index-card');
  if (filterBtns.length && cards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.filter;
        filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        cards.forEach((card) => {
          const match = key === 'all' || card.dataset.category === key;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* 5. COPIAR CORREO */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copiado ✓';
      } catch {
        btn.textContent = text;
      }
      setTimeout(() => {
        btn.textContent = original;
      }, 1800);
    });
  });

  /* 6. LIBRO ABIERTO DE FICHAS TÉCNICAS (SCROLL VERTICAL SOBRE EL LIBRO = CAMBIO DE PÁGINA) */
  document.querySelectorAll('[data-tech-book]').forEach((book) => {
    const sources = Array.from(book.querySelectorAll('.book-pages-data figure'));
    const spreadEl = book.querySelector('.book-spread');
    const leftPage = book.querySelector('.book-page.left');
    const rightPage = book.querySelector('.book-page.right');
    const frameEl = book.querySelector('.tech-book-frame');
    const statusEl = book.querySelector('[data-book-status]');
    const prevBtn = book.querySelector('[data-book-prev]');
    const nextBtn = book.querySelector('[data-book-next]');
    if (!sources.length || !spreadEl || !leftPage || !rightPage || !frameEl) return;

    const pages = sources.map((fig, idx) => {
      const img = fig.querySelector('img');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : '',
        folio: fig.dataset.folio || String(idx + 1).padStart(2, '0'),
        caption: fig.dataset.caption || (img ? img.getAttribute('alt') : '')
      };
    });

    // Construir pares visibles lado a lado en la misma línea horizontal
    const spreads = [];
    if (pages.length <= 2) {
      spreads.push([0, Math.min(1, pages.length - 1)]);
    } else if (pages.length % 2 === 0) {
      for (let i = 0; i < pages.length; i += 2) {
        spreads.push([i, i + 1]);
      }
    } else {
      for (let i = 0; i <= pages.length - 2; i++) {
        spreads.push([i, i + 1]);
      }
    }

    let spreadIndex = 0;
    let wheelLockUntil = 0;

    function fillPageSlot(slotEl, pageData) {
      const folioEl = slotEl.querySelector('.book-folio');
      const imgEl = slotEl.querySelector('.book-page-media img');
      const capEl = slotEl.querySelector('.book-page-caption');
      if (folioEl) folioEl.textContent = `Ficha ${pageData.folio}`;
      if (imgEl) {
        imgEl.src = pageData.src;
        imgEl.alt = pageData.alt;
      }
      if (capEl) capEl.textContent = pageData.caption;
      slotEl.dataset.zoomSrc = pageData.src;
      slotEl.dataset.zoomCaption = pageData.caption;
    }

    function renderSpread(dir) {
      const [li, ri] = spreads[spreadIndex];
      if (dir) {
        const cls = dir > 0 ? 'is-turning-next' : 'is-turning-prev';
        spreadEl.classList.add(cls);
        setTimeout(() => {
          fillPageSlot(leftPage, pages[li]);
          fillPageSlot(rightPage, pages[ri]);
          spreadEl.classList.remove(cls);
        }, 120);
      } else {
        fillPageSlot(leftPage, pages[li]);
        fillPageSlot(rightPage, pages[ri]);
      }

      if (statusEl) {
        statusEl.textContent = `Pág. ${pages[li].folio}–${pages[ri].folio} / ${String(pages.length).padStart(2, '0')}`;
      }
      if (prevBtn) prevBtn.disabled = spreadIndex <= 0;
      if (nextBtn) nextBtn.disabled = spreadIndex >= spreads.length - 1;
    }

    function stepSpread(dir) {
      const target = spreadIndex + dir;
      if (target < 0 || target >= spreads.length) return false;
      spreadIndex = target;
      renderSpread(dir);
      return true;
    }

    [leftPage, rightPage].forEach((slot) => {
      slot.addEventListener('click', () => {
        if (slot.dataset.zoomSrc) openLightbox(slot.dataset.zoomSrc, slot.dataset.zoomCaption || '');
      });
      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (slot.dataset.zoomSrc) openLightbox(slot.dataset.zoomSrc, slot.dataset.zoomCaption || '');
        }
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => stepSpread(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => stepSpread(1));

    // Scroll vertical con el cursor sobre el libro cambia de hoja cuando hay más fichas
    frameEl.addEventListener(
      'wheel',
      (e) => {
        if (spreads.length <= 1) return;
        const dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (Math.abs(dy) < 6) return;
        const dir = dy > 0 ? 1 : -1;
        const canMove = (dir > 0 && spreadIndex < spreads.length - 1) || (dir < 0 && spreadIndex > 0);
        if (!canMove) return;

        e.preventDefault();
        const now = performance.now();
        if (now < wheelLockUntil) return;
        wheelLockUntil = now + 340;
        stepSpread(dir);
      },
      { passive: false }
    );

    renderSpread(0);
  });
})();
