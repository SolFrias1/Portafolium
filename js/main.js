/* ==========================================================================
   STICKY HEADER AL BAJAR + NÚMEROS VERTICALES EN COLUMNA + PARALLAX + ZOOM 1s
   ========================================================================== */

(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. STICKY HEADER AL PASAR EL HERO 3D + MENÚ MÓVIL */
  const siteHeader = document.getElementById('siteHeader');
  const haloRoot = document.getElementById('haloRoot');
  const menuBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawer');

  function updateStickyHeader() {
    if (!siteHeader || !haloRoot) return;
    const pastHero = window.scrollY > haloRoot.offsetHeight * 0.72;
    siteHeader.classList.toggle('is-sticky-visible', pastHero);
  }

  if (siteHeader && haloRoot) {
    window.addEventListener('scroll', updateStickyHeader, { passive: true });
    updateStickyHeader();
  }

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

  /* 2. CANVAS PANÓPTICO VIVO PARA DOMESTICADAS (T06) */
  function initDomesticadasCanvases() {
    const canvases = document.querySelectorAll('canvas[data-domesticadas-canvas]');
    canvases.forEach((canvas) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const cols = 10;
      const rows = 6;
      const w = (canvas.width = 640);
      const h = (canvas.height = 400);
      const cw = w / cols;
      const ch = h / rows;

      function drawFrame(t) {
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

        const mx = w * (0.5 + 0.26 * Math.sin(t * 0.0012));
        const my = h * (0.5 + 0.22 * Math.cos(t * 0.0017));
        ctx.strokeStyle = '#E5B25D';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(mx, my, 32, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#F4F1EA';
        ctx.font = '12px "IBM Plex Mono", monospace';
        ctx.fillText('corral → ojo / cursor → chisme humano', 18, h - 18);

        if (!prefersReduced) requestAnimationFrame(drawFrame);
      }

      drawFrame(1200);
    });
  }

  /* 3. RENDER DE PROYECTOS CON NÚMEROS ORDENADOS EN VERTICAL SEMI-TRANSPARENTES */
  const projects = window.PORTFOLIO_PROJECTS || [];
  const ppiContainer = document.getElementById('ppiShowcaseList');
  const indumentariaContainer = document.getElementById('indumentariaShowcaseList');
  const industrialContainer = document.getElementById('industrialShowcaseList');

  function renderProjectRow(p, idx) {
    const isReversed = idx % 2 === 1;
    const parallaxSpeed = isReversed ? '-0.05' : '0.06';
    const textSpeed = isReversed ? '0.03' : '-0.03';
    const canExpand = Boolean(p.heroImage);
    const numLabel = `${String(idx + 1).padStart(2, '0')}/`;

    const orientationClass = p.id === 'crisol' ? ' is-vertical-work' : '';

    let mediaHtml = '';
    if (p.id === 'crisol') {
      mediaHtml = `
        <video class="primary-media" autoplay muted loop playsinline poster="${p.heroImage}" aria-label="${p.heroAlt}">
          <source src="videos/crisol-loop.webm" type="video/webm">
          <img src="${p.heroImage}" alt="${p.heroAlt}">
        </video>
      `;
    } else if (p.heroImage) {
      mediaHtml = `<img class="primary-media" src="${p.heroImage}" alt="${p.heroAlt}">`;
    } else if (p.plateType === 'panoptic') {
      mediaHtml = `<canvas class="primary-media" data-domesticadas-canvas aria-label="${p.heroAlt}"></canvas>`;
    }

    const detailHtml = p.detailImage
      ? `<img class="detail-swap-img" src="${p.detailImage}" alt="${p.detailAlt || p.title}">`
      : '';

    return `
      <article id="proj-${p.id}" class="editorial-project-row${isReversed ? ' is-reversed' : ''}${orientationClass}">
        <div class="project-visual-col" data-parallax="${parallaxSpeed}">
          <div class="visual-color-backdrop" data-clip-reveal>
            <div
              class="visual-frame"
              ${canExpand ? `data-expand-src="${p.heroImage}" data-expand-detail="${p.detailImage || ''}" data-expand-title="${p.title}" role="button" tabindex="0" aria-label="Ampliar ${p.title}"` : ''}
            >
              ${mediaHtml}
              ${detailHtml}
            </div>
          </div>
        </div>

        <div class="project-info-col" data-parallax="${textSpeed}">
          <span class="project-big-index">${numLabel}</span>
          <h3 class="project-huge-title">${p.titleHtml || p.title}</h3>
          <p class="project-serif-sub">${p.code} · ${p.categoryLabel}</p>

          <div class="project-actions">
            <a href="${p.url}" class="on-band-btn solid">Ver proyecto →</a>
            ${
              p.liveUrl
                ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="on-band-btn">Demo ↗</a>`
                : ''
            }
            ${
              p.repoUrl
                ? `<a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="on-band-btn">GitHub ↗</a>`
                : ''
            }
          </div>
        </div>
      </article>
    `;
  }

  if (ppiContainer) {
    const ppiOrder = ['umwelt', 'domesticadas', 'realidades', 'crisol'];
    const ppiProjects = ppiOrder.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    ppiContainer.innerHTML = ppiProjects.map((p, i) => renderProjectRow(p, i)).join('');
  }

  if (indumentariaContainer) {
    const indOrder = ['bivalvia', 'vestido-yara'];
    const indProjects = indOrder.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    indumentariaContainer.innerHTML = indProjects.map((p, i) => renderProjectRow(p, i)).join('');
  }

  if (industrialContainer) {
    const prodOrder = ['taller-local'];
    const prodProjects = prodOrder.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    industrialContainer.innerHTML = prodProjects.map((p, i) => renderProjectRow(p, i)).join('');
  }

  initDomesticadasCanvases();

  /* 4. REBOTE HORIZONTAL DESDE LOS COSTADOS + REVELADO DE IMÁGENES */
  const revealItems = document.querySelectorAll('[data-clip-reveal], [data-bounce]');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.hasAttribute('data-clip-reveal')) {
              entry.target.classList.add('is-revealed');
            }
            if (entry.target.hasAttribute('data-bounce')) {
              entry.target.classList.add('is-entered');
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 }
    );
    revealItems.forEach((el) => obs.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-revealed', 'is-entered'));
  }

  /* 5. PARALLAX SCROLLING PARA COLUMNAS DE PROYECTO */
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!prefersReduced && parallaxEls.length) {
    let ticking = false;

    function updateParallax() {
      ticking = false;
      if (window.innerWidth < 820) {
        parallaxEls.forEach((el) => (el.style.transform = ''));
        return;
      }
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0');
        const rect = el.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(centerOffset * speed).toFixed(1)}px, 0)`;
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
    updateParallax();
  }

  /* 6. CURSOR INTERACTIVO (+ DETALLE) Y LIGHTBOX */
  const cursorFollower = document.getElementById('cursorFollower');
  const lightbox = document.getElementById('fullbleedLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const toggleDetailBtn = document.getElementById('toggleDetailBtn');
  const closeLightboxBtn = document.getElementById('closeLightbox');

  let currentPrimarySrc = '';
  let currentDetailSrc = '';
  let showingDetail = false;

  function openLightbox(src, detailSrc, title) {
    if (!lightbox || !lightboxImg) return;
    currentPrimarySrc = src;
    currentDetailSrc = detailSrc || '';
    showingDetail = false;

    lightboxImg.src = currentPrimarySrc;
    lightboxImg.alt = title || '';
    if (lightboxTitle) lightboxTitle.textContent = title || '';

    if (toggleDetailBtn) {
      toggleDetailBtn.hidden = !currentDetailSrc;
      toggleDetailBtn.textContent = 'Ver detalle ↔';
    }

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

  if (toggleDetailBtn) {
    toggleDetailBtn.addEventListener('click', () => {
      if (!currentDetailSrc || !lightboxImg) return;
      showingDetail = !showingDetail;
      lightboxImg.src = showingDetail ? currentDetailSrc : currentPrimarySrc;
      toggleDetailBtn.textContent = showingDetail ? 'Vista principal ↔' : 'Ver detalle ↔';
    });
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

  document.querySelectorAll('.visual-frame').forEach((frame) => {
    const primary = frame.querySelector('.primary-media');

    if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
      frame.addEventListener('pointerenter', () => {
        if (cursorFollower) {
          cursorFollower.textContent = frame.dataset.expandDetail
            ? '+ Detalle'
            : frame.dataset.expandSrc
            ? '+ Ampliar'
            : '+ Ver';
          cursorFollower.classList.add('is-active');
        }
      });

      frame.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        if (cursorFollower) {
          cursorFollower.style.left = `${e.clientX}px`;
          cursorFollower.style.top = `${e.clientY}px`;
        }
        if (primary && primary.tagName !== 'CANVAS') {
          const r = frame.getBoundingClientRect();
          const ox = ((e.clientX - r.left) / r.width) * 100;
          const oy = ((e.clientY - r.top) / r.height) * 100;
          primary.style.transformOrigin = `${ox.toFixed(1)}% ${oy.toFixed(1)}%`;
        }
      });

      frame.addEventListener('pointerleave', () => {
        if (cursorFollower) cursorFollower.classList.remove('is-active');
        if (primary) primary.style.transformOrigin = 'center center';
      });
    }

    if (frame.dataset.expandSrc) {
      frame.addEventListener('click', () =>
        openLightbox(frame.dataset.expandSrc, frame.dataset.expandDetail, frame.dataset.expandTitle)
      );
      frame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(frame.dataset.expandSrc, frame.dataset.expandDetail, frame.dataset.expandTitle);
        }
      });
    }
  });

  /* 7. COPIAR CORREO */
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
})();
