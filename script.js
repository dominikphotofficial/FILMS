// ==========================================================================
// DP.FILMS — Unified Client Script (Navigation, Hero, Filmography,
// Frozen Time Cold->Warm Transition, YouTube Overlay, Submissions)
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import {
  firebaseConfig,
  FIRESTORE_COLLECTION,
  STORAGE_FOLDER,
  NOTIFICATION_EMAIL,
  TRIGGER_EMAIL_FROM,
  filmsList,
  awardsData
} from './firebase-config.js';

const currentLang = document.documentElement.lang === 'lt' ? 'lt' : 'en';
const rootPrefix = document.body?.getAttribute('data-root') || '';
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => reducedMotionQuery.matches;

let app = null;
let db = null;
let storage = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn('[DP.FILMS] Firebase init notice:', err);
}

// --------------------------------------------------------------------------
// 1. Header Scroll State & Hero Scroll/Progress Visibility
// --------------------------------------------------------------------------
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  const heroScroll = document.querySelector('.hero-scroll');
  const heroProgress = document.querySelector('.hero-progress');

  const updateScroll = () => {
    const y = window.scrollY || window.pageYOffset || 0;
    if (header) {
      header.classList.toggle('scrolled', y > 80);
    }
    const hideHeroHints = y > 40;
    if (heroScroll) heroScroll.classList.toggle('hidden', hideHeroHints);
    if (heroProgress) heroProgress.classList.toggle('hidden', hideHeroHints);
  };

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

// --------------------------------------------------------------------------
// 2. Burger Trigger & Slide-Over Navigation Drawer
// --------------------------------------------------------------------------
function initDrawerMenu() {
  const burger = document.getElementById('burger-menu');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('nav-close');
  if (!burger || !overlay) return;

  let lastTrigger = null;

  const openMenu = () => {
    lastTrigger = document.activeElement;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (closeBtn) closeBtn.focus();
  };

  const closeMenu = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  };

  burger.addEventListener('click', () => {
    if (overlay.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  overlay.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  function trapModalTab(container, event) {
    if (event.key !== 'Tab') return;
    const focusables = Array.from(
      container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') {
      closeMenu();
    } else {
      trapModalTab(overlay, e);
    }
  });
}

// --------------------------------------------------------------------------
// 3. Home Hero Slideshow (6000ms interval, manual progress jump)
// --------------------------------------------------------------------------
function initHeroSlideshow() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const lines = Array.from(document.querySelectorAll('.hero-progress-line'));
  if (slides.length <= 1) return;

  let currentIndex = slides.findIndex((s) => s.classList.contains('active'));
  if (currentIndex < 0) currentIndex = 0;

  let timer = null;

  const setSlide = (idx) => {
    currentIndex = (idx + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });
    lines.forEach((line, i) => {
      line.classList.toggle('active', i === currentIndex);
      line.setAttribute('aria-pressed', i === currentIndex ? 'true' : 'false');
    });
  };

  const startTimer = () => {
    if (prefersReducedMotion()) return;
    clearInterval(timer);
    timer = setInterval(() => {
      setSlide(currentIndex + 1);
    }, 6000);
  };

  lines.forEach((line, index) => {
    line.addEventListener('click', () => {
      setSlide(index);
      startTimer();
    });
  });

  startTimer();
}

// --------------------------------------------------------------------------
// 4. IntersectionObserver Reveals & Lazy Image Fade
// --------------------------------------------------------------------------
function observeReveals(scope = document) {
  const targets = Array.from(scope.querySelectorAll('.fade-in-up, .reveal'));
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  targets.forEach((el) => {
    if (el.classList.contains('film-card') && el.parentElement?.classList.contains('film-grid')) {
      const siblings = Array.from(el.parentElement.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${(idx % 2) * 80}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -24px 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  // Fallback timer ensures no element stalls invisible
  setTimeout(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120) {
        el.classList.add('visible');
      }
    });
  }, 450);
}

function initLazyImages(scope = document) {
  const images = Array.from(scope.querySelectorAll('img.dp-lazy'));
  images.forEach((img) => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });
}

// --------------------------------------------------------------------------
// 5. Smooth Page Leave Fade (200ms) + bfcache Reset
// --------------------------------------------------------------------------
function initPageTransitions() {
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('page-leaving');
  });

  document.addEventListener('click', (e) => {
    if (prefersReducedMotion()) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const href = link.getAttribute('href') || '';
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      return;
    }

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;
    if (url.pathname.toLowerCase().endsWith('.pdf')) return;

    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => {
      window.location.href = url.href;
    }, 200);
  });
}

// --------------------------------------------------------------------------
// 6. Frozen Time: Background Hero Video, Cold -> Warmth & Type Motion
// --------------------------------------------------------------------------
function shouldReduceDataOrMotion() {
  if (prefersReducedMotion()) return true;
  if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return true;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && conn.saveData) return true;
  return false;
}

function initFrozenTimeHeroVideo() {
  if (!document.body.classList.contains('frozen-time')) return;
  const wrap = document.getElementById('hero-video-wrap');
  const poster = document.getElementById('hero-poster-img');
  if (!wrap) return;

  const filmId = wrap.getAttribute('data-hero-youtube-id') || '';
  if (!filmId || shouldReduceDataOrMotion()) return;

  const mountVideo = () => {
    window.requestAnimationFrame(() => {
      if (wrap.querySelector('iframe')) return;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(filmId)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${encodeURIComponent(filmId)}&playsinline=1&rel=0&modestbranding=1`;
      iframe.title = 'Frozen Time: What If — Background Film';
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      iframe.addEventListener('load', () => {
        wrap.classList.add('is-ready');
      }, { once: true });
      iframe.addEventListener('error', () => {
        wrap.innerHTML = '';
        wrap.classList.remove('is-ready');
      }, { once: true });
      wrap.appendChild(iframe);
    });
  };

  if (poster && !poster.complete) {
    poster.addEventListener('load', mountVideo, { once: true });
    poster.addEventListener('error', mountVideo, { once: true });
  } else {
    mountVideo();
  }
}

function initFrozenTimeWarmth() {
  if (!document.body.classList.contains('frozen-time')) return;

  const progressFill = document.querySelector('.reading-progress-fill');
  const warmthSections = Array.from(document.querySelectorAll('[data-warmth]'));

  if (warmthSections.length && 'IntersectionObserver' in window) {
    const warmthObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const val = parseFloat(entry.target.getAttribute('data-warmth') || '0');
            if (!Number.isNaN(val)) {
              document.body.style.setProperty('--warmth', String(Math.min(1, Math.max(0, val))));
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    warmthSections.forEach((sec) => warmthObserver.observe(sec));
  }

  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    if (!progressFill) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
    progressFill.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();
}

function initLineReveals() {
  if (!document.body.classList.contains('frozen-time')) return;
  const targets = Array.from(document.querySelectorAll('body.frozen-time .editorial-sticky-col h2, body.frozen-time .pull-quote-text'));
  if (!targets.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-lines-visible'));
    return;
  }

  targets.forEach((el) => {
    const rawText = el.textContent.trim();
    if (!rawText) return;
    const words = rawText.split(/\s+/);
    el.innerHTML = '';
    const wordSpans = words.map((w, idx) => {
      const span = document.createElement('span');
      span.textContent = w;
      el.appendChild(span);
      if (idx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
      return span;
    });

    const lines = [];
    let currentTop = null;
    let currentLineWords = [];
    wordSpans.forEach((span) => {
      const top = Math.round(span.getBoundingClientRect().top);
      if (currentTop === null || Math.abs(top - currentTop) <= 4) {
        currentTop = currentTop === null ? top : currentTop;
        currentLineWords.push(span.textContent);
      } else {
        lines.push(currentLineWords.join(' '));
        currentTop = top;
        currentLineWords = [span.textContent];
      }
    });
    if (currentLineWords.length) {
      lines.push(currentLineWords.join(' '));
    }

    el.innerHTML = '';
    lines.forEach((lineText, idx) => {
      const wrap = document.createElement('span');
      wrap.className = 'line-wrap';
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.style.transitionDelay = `${idx * 80}ms`;
      inner.textContent = lineText;
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lines-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

// --------------------------------------------------------------------------
// 7. Reusable Fullscreen YouTube Lightbox Component (data-youtube-id)
// --------------------------------------------------------------------------
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PLAY_ICON_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6,4 20,12 6,20"></polygon></svg>`;

export function createYouTubeLightbox(options = {}) {
  const lang = options.lang === 'lt' ? 'lt' : 'en';
  let overlay = document.getElementById('video-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'video-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-label', lang === 'lt' ? 'Filmo grotuvas' : 'Film Player');
    overlay.innerHTML = `
      <div class="video-overlay-top">
        <div class="video-overlay-meta">
          <span class="video-overlay-title" id="video-overlay-title">DP.FILMS</span>
          <a href="#" target="_blank" rel="noopener noreferrer" class="video-overlay-yt" id="video-overlay-yt">
            ${lang === 'lt' ? 'Atidaryti YouTube ↗' : 'Watch on YouTube ↗'}
          </a>
        </div>
        <button type="button" class="video-overlay-close" id="video-overlay-close" aria-label="${lang === 'lt' ? 'Uždaryti grotuvą' : 'Close player'}">&times;</button>
      </div>
      <div class="video-overlay-stage" id="video-overlay-stage"></div>
    `;
    document.body.appendChild(overlay);
  }

  const stage = overlay.querySelector('#video-overlay-stage');
  const titleEl = overlay.querySelector('#video-overlay-title');
  const ytLink = overlay.querySelector('#video-overlay-yt');
  const closeBtn = overlay.querySelector('#video-overlay-close');
  let lastFocus = null;
  let bound = overlay.dataset.bound === '1';

  const open = (youtubeId, title = 'DP.FILMS') => {
    if (!youtubeId) return;
    lastFocus = document.activeElement;
    if (titleEl) titleEl.textContent = title;
    if (ytLink) ytLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
    if (stage) {
      stage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0&modestbranding=1" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    closeBtn?.focus();
  };

  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    // Destroy the iframe immediately to stop audio & playback
    if (stage) stage.innerHTML = '';
    document.body.classList.remove('menu-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  };

  if (!bound) {
    overlay.dataset.bound = '1';

    closeBtn?.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          overlay.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-youtube-id]');
      if (!trigger) return;
      e.preventDefault();
      const ytId = trigger.getAttribute('data-youtube-id');
      const title = trigger.getAttribute('data-film-title') || trigger.textContent?.trim() || 'DP.FILMS';
      if (ytId) {
        open(ytId, title);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const focusedTrigger = document.activeElement?.closest('[data-youtube-id]');
        if (focusedTrigger && focusedTrigger.tagName !== 'BUTTON' && focusedTrigger.tagName !== 'A') {
          e.preventDefault();
          focusedTrigger.click();
        }
      }
    });
  }

  return { open, close, element: overlay };
}

function initVideoOverlay() {
  const lightbox = createYouTubeLightbox({ lang: currentLang });
  window.DPYouTubeLightbox = lightbox;
}

// --------------------------------------------------------------------------
// 8. Filmography Card Renderer (Staggered Magazine Grid, Visible Video Previews)
// --------------------------------------------------------------------------
function bindFilmThumbnailFallback(img, fallbackThumb) {
  if (!img) return;
  const applyFallback = () => {
    if (img.dataset.fb !== '1') {
      img.dataset.fb = '1';
      img.src = fallbackThumb;
    }
  };
  img.addEventListener('error', applyFallback);
  img.addEventListener('load', () => {
    // YouTube returns a 120x90 grey placeholder when maxresdefault does not exist
    if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
      applyFallback();
    }
  });
}

function buildFilmCard(film) {
  const article = document.createElement('article');
  article.className = 'film-card fade-in-up';

  const rolesList = film.roles?.[currentLang] || film.roles?.en || [];
  const rolesCredits = rolesList.map((roleLabel) => `${roleLabel}: Dominik Šuškevič`).join(' · ');
  const descText = film.desc?.[currentLang] || film.desc?.en || '';
  const awardSuffix = film.award?.[currentLang] ? ` · ${film.award[currentLang]}` : '';
  const watchLabel = currentLang === 'lt' ? 'Žiūrėti filmą →' : 'Watch Film →';
  const captureBadge = currentLang === 'lt' ? 'Video peržiūra' : 'Watch Film';
  const detailsLabel = currentLang === 'lt' ? 'Apie filmą' : 'Film Page';
  const thumbUrl = `https://img.youtube.com/vi/${film.youtubeId}/maxresdefault.jpg`;
  const fallbackThumb = `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`;

  const metaText = film.duration ? `${film.year} · ${film.duration}${awardSuffix}` : `${film.year}${awardSuffix}`;

  article.innerHTML = `
    <div class="film-card-media" data-youtube-id="${film.youtubeId}" data-film-title="${escapeHtml(film.title)}" tabindex="0" role="button" aria-label="${escapeHtml(watchLabel)} ${escapeHtml(film.title)}">
      <img src="${thumbUrl}" alt="${escapeHtml(film.title)} — DP.FILMS" decoding="async" width="1280" height="720">
      <div class="film-facade-play" aria-hidden="true">
        <span class="film-facade-btn">${PLAY_ICON_SVG}</span>
      </div>
      <div class="film-capture-bar" aria-hidden="true">
        <span>${captureBadge}</span>
        <span>${escapeHtml(film.duration || film.year)}</span>
      </div>
    </div>
    <div class="film-card-body">
      <h3 class="film-card-title">${escapeHtml(film.title)}</h3>
      <div class="film-card-meta">${escapeHtml(metaText)}</div>
      <div class="film-roles">${escapeHtml(rolesCredits)}</div>
      <p class="film-card-desc">${escapeHtml(descText)}</p>
      <div class="film-card-actions">
        <button type="button" class="film-card-action" data-youtube-id="${film.youtubeId}" data-film-title="${escapeHtml(film.title)}">${watchLabel}</button>
        <div style="display:flex;align-items:center;gap:16px;">
          ${film.detailUrl?.[currentLang] ? `<a href="${rootPrefix}${film.detailUrl[currentLang]}" class="film-yt-link">${detailsLabel}</a>` : ''}
          <a href="https://www.youtube.com/watch?v=${film.youtubeId}" target="_blank" rel="noopener noreferrer" class="film-yt-link">YouTube ↗</a>
        </div>
      </div>
    </div>
  `;

  bindFilmThumbnailFallback(article.querySelector('.film-card-media img'), fallbackThumb);
  return article;
}

function initFilmGrids() {
  const previewGrid = document.getElementById('film-grid-preview');
  const allGrid = document.getElementById('film-grid-all');

  if (previewGrid) {
    previewGrid.innerHTML = '';
    filmsList.slice(0, 4).forEach((film) => {
      previewGrid.appendChild(buildFilmCard(film));
    });
    observeReveals(previewGrid);
  }

  if (allGrid) {
    allGrid.innerHTML = '';
    filmsList.forEach((film) => {
      allGrid.appendChild(buildFilmCard(film));
    });
    observeReveals(allGrid);
  }
}

// --------------------------------------------------------------------------
// 9. Awards Hairline Renderer
// --------------------------------------------------------------------------
function initAwardsRows() {
  const container = document.getElementById('awards-rows');
  if (!container) return;

  container.innerHTML = '';
  awardsData.forEach((row) => {
    const el = document.createElement('div');
    el.className = 'hairline-row fade-in-up';
    const title = row.title?.[currentLang] || row.title?.en || '';
    const result = row.result?.[currentLang] || row.result?.en || '';
    const place = row.place?.[currentLang] || row.place?.en || '';
    const href = row.href ? `${rootPrefix}${row.href}` : '';

    el.innerHTML = `
      <span class="hairline-row-year">${escapeHtml(row.year)}</span>
      <span class="hairline-row-title">${href ? `<a href="${href}">${escapeHtml(title)}</a>` : escapeHtml(title)}</span>
      <span class="hairline-row-result">${escapeHtml(result)}</span>
      <span class="hairline-row-place">${escapeHtml(place)}</span>
    `;
    container.appendChild(el);
  });

  observeReveals(container);
}


// --------------------------------------------------------------------------
// 11. Team Submission Form (Storage Upload + Atomic Firestore Batch)
// --------------------------------------------------------------------------
function normalizeCategory(roleValue) {
  const val = String(roleValue || '').toLowerCase();
  if (val.includes('screenwriter') || val.includes('writer') || val.includes('scenar')) return 'Screenwriters';
  if (val.includes('actor') || val.includes('actress') || val.includes('aktori')) return 'Actors';
  if (val.includes('director') || val.includes('režisier')) return 'Directors';
  if (val.includes('sound') || val.includes('composer') || val.includes('gars') || val.includes('kompoz')) return 'Sound';
  return 'Crew';
}

function initSubmissionForm() {
  const form = document.getElementById('film-proposal-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn');
  const alertBox = document.getElementById('form-alert-box');
  const successCard = document.getElementById('form-success-card');
  const successDesc = document.getElementById('form-success-desc');
  const fileInput = document.getElementById('input-file');
  const fileDropZone = document.getElementById('file-drop-zone');
  const fileSelectedRow = document.getElementById('file-selected-badge');
  const fileNameDisplay = document.getElementById('file-name-display');
  const btnRemoveFile = document.getElementById('btn-remove-file');
  const progressBox = document.getElementById('upload-progress-box');
  const progressBar = document.getElementById('upload-progress-bar');

  let currentFile = null;

  const clearAlert = () => {
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
  };

  const showAlert = (msg, canRetry = false) => {
    if (!alertBox) return;
    if (canRetry) {
      alertBox.innerHTML = `
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="flex:1;">
            <strong>${currentLang === 'lt' ? 'Nepavyko išsiųsti paraiškos' : 'Submission failed'}</strong>
            <div style="margin-top:4px;">${escapeHtml(msg)}</div>
          </div>
          <button type="button" id="btn-alert-retry" class="btn-primary btn-sm">
            ${currentLang === 'lt' ? 'Bandyti dar kartą' : 'Retry Submission'}
          </button>
        </div>
      `;
      document.getElementById('btn-alert-retry')?.addEventListener('click', () => {
        clearAlert();
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
    } else {
      alertBox.innerHTML = `<div>${escapeHtml(msg)}</div>`;
    }
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  };

  const handleFileSelect = (file) => {
    const allowedExt = ['.pdf', '.doc', '.docx', '.txt'];
    const lowerName = file.name.toLowerCase();
    const validType = allowedExt.some((ext) => lowerName.endsWith(ext));
    if (!validType) {
      showAlert(currentLang === 'lt'
        ? 'Leidžiami tik .pdf, .doc, .docx arba .txt failai.'
        : 'Only .pdf, .doc, .docx, or .txt files are allowed.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      showAlert(currentLang === 'lt'
        ? 'Failas viršija 25 MB limitą. Prašome įdėti nuorodą žinutėje.'
        : 'File exceeds the 25 MB limit. Please share a link in your message.');
      return;
    }
    currentFile = file;
    if (fileNameDisplay) fileNameDisplay.textContent = `${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`;
    if (fileSelectedRow) fileSelectedRow.style.display = 'flex';
    clearAlert();
  };

  if (fileDropZone && fileInput) {
    fileDropZone.addEventListener('click', () => fileInput.click());
    fileDropZone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
    fileDropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDropZone.classList.add('drag-active');
    });
    fileDropZone.addEventListener('dragleave', () => {
      fileDropZone.classList.remove('drag-active');
    });
    fileDropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      fileDropZone.classList.remove('drag-active');
      if (e.dataTransfer?.files?.length) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files?.length) {
        handleFileSelect(fileInput.files[0]);
      }
    });
  }

  btnRemoveFile?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFile = null;
    if (fileInput) fileInput.value = '';
    if (fileSelectedRow) fileSelectedRow.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const honeypot = form.elements['website_hp']?.value;
    if (honeypot) {
      form.style.display = 'none';
      if (successCard) successCard.classList.add('visible');
      return;
    }

    const lastSubmit = localStorage.getItem('dp_last_submit_ts');
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 45000) {
      const waitSec = Math.ceil((45000 - (now - parseInt(lastSubmit, 10))) / 1000);
      showAlert(currentLang === 'lt'
        ? `Prašome palaukti ${waitSec} s prieš siunčiant kitą užklausą.`
        : `Please wait ${waitSec}s before sending another submission.`);
      return;
    }

    const name = form.elements['name']?.value?.trim() || '';
    const country = form.elements['country']?.value?.trim() || 'Global';
    const role = form.elements['role']?.value || 'Other';
    const type = form.elements['type']?.value || 'Join the Film Team';
    const contactType = form.elements['contactType']?.value || 'Email';
    const handle = form.elements['handle']?.value?.trim() || '';
    const message = form.elements['message']?.value?.trim() || '';
    const consent = Boolean(form.elements['consent']?.checked);

    if (!name || !country || !handle || !message) {
      showAlert(currentLang === 'lt' ? 'Prašome užpildyti visus privalomus laukus.' : 'Please complete all required fields.');
      return;
    }

    if (contactType === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handle)) {
      showAlert(currentLang === 'lt'
        ? 'Įveskite teisingą el. pašto adresą.'
        : 'Please enter a valid email address.');
      return;
    }

    if (!consent) {
      showAlert(currentLang === 'lt'
        ? 'Prašome pažymėti sutikimą su privatumo politika.'
        : 'Please accept the Privacy Policy checkbox to proceed.');
      return;
    }

    const origText = submitBtn?.innerHTML || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = currentLang === 'lt' ? 'Siunčiama...' : 'Sending...';
    }

    try {
      let fileUrl = null;
      let fileName = null;
      let fileSizeBytes = null;
      let storagePath = null;
      const file = currentFile || fileInput?.files?.[0];

      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;
        if (progressBox) progressBox.style.display = 'block';
        if (progressBar) progressBar.style.width = '25%';

        if (storage) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          storagePath = `${STORAGE_FOLDER}/${Date.now()}_${safeName}`;
          const storageRef = ref(storage, storagePath);

          await new Promise((resolve) => {
            const timeout = setTimeout(resolve, 14000);
            const task = uploadBytesResumable(storageRef, file);
            task.on(
              'state_changed',
              (snapshot) => {
                if (snapshot.totalBytes > 0 && progressBar) {
                  const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  progressBar.style.width = `${Math.min(95, pct)}%`;
                }
              },
              () => {
                clearTimeout(timeout);
                resolve();
              },
              async () => {
                clearTimeout(timeout);
                if (progressBar) progressBar.style.width = '100%';
                try {
                  fileUrl = await getDownloadURL(task.snapshot.ref);
                } catch {}
                resolve();
              }
            );
          });
        }
      }

      const category = normalizeCategory(role);
      const submissionDoc = {
        name,
        country,
        role,
        category,
        type,
        contactType,
        handle,
        contact: `${contactType}: ${handle}`,
        message,
        status: 'new',
        unread: true,
        notes: '',
        lang: currentLang,
        fileName: fileName || null,
        fileSizeBytes: fileSizeBytes || null,
        fileMimeType: file?.type || null,
        storagePath: storagePath || null,
        fileUrl: fileUrl || null
      };

      let saved = false;

      if (db) {
        try {
          const batch = writeBatch(db);
          const subRef = doc(collection(db, FIRESTORE_COLLECTION));
          batch.set(subRef, {
            ...submissionDoc,
            createdAt: serverTimestamp()
          });

          const attachmentLine = fileName
            ? `Attachment: ${fileName} (${Math.max(1, Math.round(fileSizeBytes / 1024))} KB)\nFile URL: ${fileUrl || '(Uploaded to Storage)'}`
            : 'Attachment: None';

          const plainText = [
            `NEW FILM TEAM APPLICATION — DP.FILMS`,
            `====================================`,
            `Name:         ${name}`,
            `Country:      ${country}`,
            `Role:         ${role} [${category}]`,
            `Proposal:     ${type}`,
            `Contact:      ${contactType} — ${handle}`,
            `Language:     ${currentLang.toUpperCase()}`,
            `Submitted:    ${new Date().toUTCString()}`,
            attachmentLine,
            `------------------------------------`,
            message
          ].join('\n');

          const htmlBody = `
            <div style="font-family:Montserrat,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;background:#ffffff;border:1px solid #e8e8e8;">
              <div style="border-bottom:2px solid #113939;padding-bottom:12px;margin-bottom:20px;">
                <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#113939;font-weight:600;">DP.FILMS — New Application</div>
                <h2 style="margin:6px 0 0;font-size:20px;color:#1a1a1a;">${escapeHtml(name)} — ${escapeHtml(role)} (${escapeHtml(country)})</h2>
              </div>
              <p style="font-size:14px;line-height:1.6;margin:0 0 12px;">
                <strong>Proposal:</strong> ${escapeHtml(type)}<br>
                <strong>Contact (${escapeHtml(contactType)}):</strong> ${escapeHtml(handle)}<br>
                <strong>Country:</strong> ${escapeHtml(country)}
                ${fileName ? `<br><strong>Attachment:</strong> ${escapeHtml(fileName)}${fileUrl ? ` — <a href="${escapeHtml(fileUrl)}" style="color:#113939;">Open File</a>` : ''}` : ''}
              </p>
              <div style="background:#fafaf8;border-left:2px solid #113939;padding:16px;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</div>
            </div>
          `;

          const mailRef = doc(collection(db, 'mail'));
          batch.set(mailRef, {
            from: TRIGGER_EMAIL_FROM,
            to: [NOTIFICATION_EMAIL],
            replyTo: NOTIFICATION_EMAIL,
            message: {
              subject: `New film team application: ${name} (${role}, ${country})`,
              text: plainText,
              html: htmlBody
            },
            submissionId: subRef.id,
            createdAt: serverTimestamp()
          });

          await batch.commit();
          saved = true;
        } catch (fsErr) {
          console.warn('[DP.FILMS] Firestore batch notice:', fsErr);
        }
      }

      if (!saved) {
        try {
          const apiRes = await fetch('/api/submit-proposal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionDoc)
          });
          if (apiRes.ok) saved = true;
        } catch {}
      }

      if (!saved) {
        throw new Error('Could not complete submission.');
      }

      localStorage.setItem('dp_last_submit_ts', String(Date.now()));
      form.style.display = 'none';
      if (successDesc) {
        successDesc.textContent = currentLang === 'lt'
          ? `Ačiū, ${name}. Jūsų paraiška (${role}) sėkmingai gauta. Dominik susisieks per 48 valandas.`
          : `Thank you, ${name}. Your application (${role}) has been received. Dominik will review and reply within 48 hours.`;
      }
      if (successCard) {
        successCard.classList.add('visible');
        successCard.style.display = 'flex';
      }
    } catch (err) {
      const msg = err?.message || '';
      let readable;
      if (!navigator.onLine || msg.includes('offline')) {
        readable = currentLang === 'lt'
          ? 'Nėra interneto ryšio. Patikrinkite ryšį ir spauskite „Bandyti dar kartą“.'
          : 'You appear to be offline. Check your connection and retry.';
      } else {
        readable = currentLang === 'lt'
          ? `Nepavyko išsaugoti paraiškos duomenų bazėje. Bandykite dar kartą arba rašykite ${NOTIFICATION_EMAIL}.`
          : `Could not save your application right now. Please retry or email ${NOTIFICATION_EMAIL}.`;
      }
      showAlert(readable, true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
      if (progressBox) progressBox.style.display = 'none';
    }
  });
}

// --------------------------------------------------------------------------
// Boot
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initDrawerMenu();
  initHeroSlideshow();
  initFrozenTimeHeroVideo();
  initPageTransitions();
  initFrozenTimeWarmth();
  initLineReveals();
  initVideoOverlay();
  initFilmGrids();
  initAwardsRows();
  initSubmissionForm();
  observeReveals(document);
  initLazyImages(document);
});
