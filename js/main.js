// ==========================================================================
// DP | FILMS — Core Client Script (Multi-Page Navigation, Modals, Forms & Audio)
// Dominik Šuškevič — Videographer, Photographer & Filmmaker
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  writeBatch, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig, filmsList, FIRESTORE_COLLECTION, STORAGE_FOLDER } from '../config.js';
import { awardsData } from './awards-data.js';

// Detect active language from HTML tag
const currentLang = document.documentElement.lang === 'lt' ? 'lt' : 'en';

// Initialize Firebase SDK
let app = null;
let db = null;
let storage = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  signInAnonymously(auth).catch(() => {
    // Anonymous auth optional for direct Firestore writes if rules allow
  });
} catch (err) {
  console.warn('Firebase initialization notice:', err);
}

// ==========================================================================
// 1. Header Scroll & Mobile Navigation
// ==========================================================================
export const initNavigation = () => {
  const header = document.querySelector('.header');
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('main-nav');

  // Create or attach mobile backdrop
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const openMobileNav = () => {
    navMenu?.classList.add('mobile-active');
    backdrop.classList.add('active');
    toggleBtn?.classList.add('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('mobile-nav-open');
  };

  const closeMobileNav = () => {
    navMenu?.classList.remove('mobile-active');
    backdrop.classList.remove('active');
    toggleBtn?.classList.remove('is-active');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('mobile-nav-open');
  };

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('mobile-active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    backdrop.addEventListener('click', closeMobileNav);

    // Close on navigation click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-active')) {
        closeMobileNav();
      }
    });
  }

  // Header elevate on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
};

// ==========================================================================
// 2. Video Modal Player (youtube-nocookie with full trap, Esc, & stop playback)
// ==========================================================================
export const initVideoModal = () => {
  let modalBackdrop = document.getElementById('video-modal-backdrop');
  
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'video-modal-backdrop';
    modalBackdrop.className = 'video-modal-backdrop';
    modalBackdrop.setAttribute('role', 'dialog');
    modalBackdrop.setAttribute('aria-modal', 'true');
    modalBackdrop.setAttribute('aria-label', 'Film Video Player');
    modalBackdrop.innerHTML = `
      <div class="video-modal-container" id="video-modal-container">
        <div class="video-modal-header">
          <div class="video-modal-title" id="video-modal-title">DP | FILMS</div>
          <button type="button" class="video-modal-close" id="video-modal-close" aria-label="Close video">&times;</button>
        </div>
        <div class="video-modal-body">
          <iframe id="video-modal-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Film Player"></iframe>
        </div>
        <div class="video-modal-footer">
          <span id="video-modal-specs">SPACE. LIGHT. EMOTION.</span>
          <a href="#" target="_blank" rel="noopener noreferrer" id="video-modal-yt-link">Open on YouTube &nearr;</a>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }

  const iframe = document.getElementById('video-modal-iframe');
  const titleEl = document.getElementById('video-modal-title');
  const specsEl = document.getElementById('video-modal-specs');
  const ytLink = document.getElementById('video-modal-yt-link');
  const closeBtn = document.getElementById('video-modal-close');
  let lastFocusedElement = null;

  const openVideo = (youtubeId, title, specs) => {
    lastFocusedElement = document.activeElement;
    if (titleEl) titleEl.textContent = title || 'DP | FILMS';
    if (specsEl) specsEl.textContent = specs || 'SPACE. LIGHT. EMOTION.';
    if (ytLink) ytLink.href = `https://www.youtube.com/watch?v=${youtubeId}`;
    
    // Strict youtube-nocookie embed
    if (iframe) {
      iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  const closeVideo = () => {
    modalBackdrop.classList.remove('is-open');
    if (iframe) {
      iframe.src = ''; // Immediately stop playback
    }
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  closeBtn?.addEventListener('click', closeVideo);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeVideo();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeVideo();
    }
  });

  // Attach click listener to any video trigger on the page
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-youtube-id]');
    if (trigger) {
      e.preventDefault();
      const ytId = trigger.getAttribute('data-youtube-id');
      const title = trigger.getAttribute('data-film-title') || 'DP | FILMS';
      const specs = trigger.getAttribute('data-film-specs') || '';
      if (ytId) {
        openVideo(ytId, title, specs);
      }
    }
  });
};

// ==========================================================================
// 3. Films Showcase & Category/Year Filters (For films.html & home preview)
// ==========================================================================
export const initFilmsShowcase = () => {
  const grid = document.getElementById('films-grid');
  if (!grid) return;

  const isLt = currentLang === 'lt';

  const renderFilms = (filter = 'all') => {
    grid.innerHTML = '';

    const filtered = filmsList.filter(film => {
      if (filter === 'all') return true;
      if (filter === '2026') return film.year === '2026';
      if (filter === '2025') return film.year === '2025';
      if (filter === '2024') return film.year === '2024';
      if (filter === 'award') return !!film.award;
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">${isLt ? 'Filmų šioje kategorijoje nerasta.' : 'No films found in this category.'}</div>`;
      return;
    }

    filtered.forEach(film => {
      const card = document.createElement('article');
      card.className = 'film-card';
      const descText = isLt ? film.desc.lt : film.desc.en;

      card.innerHTML = `
        <div class="film-thumb-wrap" data-youtube-id="${film.youtubeId}" data-film-title="${film.title}" data-film-specs="${film.specs}" style="cursor: pointer;" tabindex="0" role="button" aria-label="Watch ${film.title}">
          <img 
            src="https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg" 
            alt="${film.title} — Cinematography by Dominik Šuškevič" 
            class="film-thumb"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'"
          />
          <div class="film-play-overlay">
            <div class="play-btn-circle" aria-hidden="true">&#9654;</div>
          </div>
          ${film.award ? `<span class="award-badge" style="position: absolute; top: 12px; left: 12px; font-size: 0.75rem; background: rgba(184, 134, 11, 0.92); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: 700;">★ 1st Place AISFF</span>` : ''}
          <span style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.75); color: #fff; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);">${film.year}</span>
        </div>
        <div class="film-meta">
          <div class="film-header-row">
            <h3 class="film-title">${film.title}</h3>
            <span class="film-year">${film.year}</span>
          </div>
          <div class="film-specs">${film.specs}</div>

          <!-- Detailed Production Credits (Director, Cinematographer, Editor) -->
          <div class="film-credits-box">
            <div class="film-credits-title">
              <span>🎬 ${isLt ? 'Gamybos komanda' : 'Production Credits'}</span>
            </div>
            <div class="film-credits-grid">
              <div class="film-credit-item">
                <span class="film-credit-role">${isLt ? 'Režisierius' : 'Director'}</span>
                <span class="film-credit-name">Dominik Šuškevič</span>
              </div>
              <div class="film-credit-item">
                <span class="film-credit-role">${isLt ? 'Operatorius' : 'Cinematographer'}</span>
                <span class="film-credit-name">Dominik Šuškevič</span>
              </div>
              <div class="film-credit-item">
                <span class="film-credit-role">${isLt ? 'Montuotojas' : 'Editor'}</span>
                <span class="film-credit-name">Dominik Šuškevič</span>
              </div>
            </div>
          </div>

          <p class="film-desc">${descText}</p>
          <div class="film-actions" style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <button type="button" class="btn-film-play" data-youtube-id="${film.youtubeId}" data-film-title="${film.title}" data-film-specs="${film.specs}">
              ${isLt ? 'Žiūrėti filmą' : 'Watch Film'}
            </button>
            <a href="https://www.youtube.com/watch?v=${film.youtubeId}" target="_blank" rel="noopener noreferrer" class="yt-direct-link" style="font-size: 0.8rem; color: var(--text-muted); text-decoration: none;">
              YouTube &nearr;
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  };

  renderFilms('all');

  // Filter tabs listeners
  const filterButtons = document.querySelectorAll('.filter-tab-btn[data-filter]');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderFilms(filter);
    });
  });
};

// ==========================================================================
// 4. Awards Renderer (For awards.html)
// ==========================================================================
export const initAwardsPage = () => {
  const container = document.getElementById('awards-container');
  if (!container) return;

  const isLt = currentLang === 'lt';
  container.innerHTML = '';

  awardsData.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'awards-category-block';

    const catTitle = isLt ? cat.categoryTitle.lt : cat.categoryTitle.en;
    
    let itemsHtml = '';
    if (!cat.items || cat.items.length === 0) {
      itemsHtml = `
        <div class="award-empty-state">
          <p>${isLt ? 'Netrukus — naujos konkursinės nominacijos ruošiamos.' : 'Coming soon — new competition announcements in progress.'}</p>
        </div>
      `;
    } else {
      itemsHtml = cat.items.map(item => {
        const awardTitle = isLt ? item.awardName.lt : item.awardName.en;
        const summary = isLt ? item.summary.lt : item.summary.en;

        return `
          <div class="award-card">
            <div class="award-card-header">
              <div>
                <span class="award-badge-pill">★ ${awardTitle}</span>
                <h3 style="margin-top: 8px; font-size: 1.25rem; color: var(--primary-accent);">${item.title} (${item.year})</h3>
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
                  <strong>${item.festival}</strong> &middot; ${item.location}
                </div>
              </div>
              <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                ${item.role}
              </div>
            </div>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${summary}</p>
            <div style="display: flex; gap: 12px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
              ${item.filmPageUrl ? `<a href="${item.filmPageUrl}" class="btn-primary" style="padding: 7px 14px; font-size: 0.85rem;">${isLt ? 'Skaityti filmo puslapį &rarr;' : 'View Film Page &rarr;'}</a>` : ''}
              ${item.youtubeId ? `<button type="button" class="btn-secondary" data-youtube-id="${item.youtubeId}" data-film-title="${item.title}" style="padding: 7px 14px; font-size: 0.85rem;">&#9654; ${isLt ? 'Žiūrėti filmą' : 'Watch Film'}</button>` : ''}
              ${item.festivalUrl ? `<a href="${item.festivalUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem; color: var(--primary-accent); text-decoration: underline;">${isLt ? 'Festivalio svetainė &nearr;' : 'Festival Website &nearr;'}</a>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    section.innerHTML = `
      <h2 class="awards-category-title">${catTitle}</h2>
      ${itemsHtml}
    `;

    container.appendChild(section);
  });
};

// ==========================================================================
// 5. Submission Form Engine (Atomic Firestore + Trigger Email Extension)
// ==========================================================================
export const initSubmissionForm = () => {
  const form = document.getElementById('film-proposal-form');
  if (!form) return;

  const submitBtn = document.getElementById('form-submit-btn') || document.getElementById('btn-submit-proposal') || form.querySelector('button[type="submit"]');
  const alertBox = document.getElementById('form-alert-box') || document.getElementById('form-alert');
  const successCard = document.getElementById('form-success-card');
  const successDesc = document.getElementById('form-success-desc');
  const fileInput = document.getElementById('input-file');
  const fileDropZone = document.getElementById('file-drop-zone');
  const fileSelectedBadge = document.getElementById('file-selected-badge');
  const fileNameDisplay = document.getElementById('file-name-display');
  const btnRemoveFile = document.getElementById('btn-remove-file');
  const progressBox = document.getElementById('upload-progress-box');
  const progressBar = document.getElementById('upload-progress-bar');

  let currentFile = null;

  // File picker handler
  if (fileDropZone && fileInput) {
    fileDropZone.addEventListener('click', () => fileInput.click());

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
      if (e.dataTransfer.files?.length) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files?.length) {
        handleFileSelect(fileInput.files[0]);
      }
    });
  }

  const handleFileSelect = (file) => {
    // 25MB limit check
    if (file.size > 25 * 1024 * 1024) {
      showAlert(currentLang === 'lt' 
        ? 'Failas viršija 25 MB limitą. Prašome pateikti nuorodą žinutėje.' 
        : 'File exceeds 25 MB limit. Please provide a link in the message.');
      return;
    }
    currentFile = file;
    if (fileNameDisplay) fileNameDisplay.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    if (fileSelectedBadge) fileSelectedBadge.style.display = 'inline-flex';
    clearAlert();
  };

  btnRemoveFile?.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFile = null;
    if (fileInput) fileInput.value = '';
    if (fileSelectedBadge) fileSelectedBadge.style.display = 'none';
  });

  const showAlert = (msg, canRetry = false) => {
    if (alertBox) {
      if (canRetry) {
        alertBox.innerHTML = `
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="flex: 1;">
              <strong>⚠️ ${currentLang === 'lt' ? 'Nepavyko išsiųsti paraiškos' : 'Submission failed'}</strong>
              <div style="margin-top: 4px; font-size: 0.9rem;">${msg}</div>
            </div>
            <button type="button" id="btn-alert-retry" class="btn-primary" style="padding: 6px 14px; font-size: 0.82rem; align-self: center;">
              🔄 ${currentLang === 'lt' ? 'Bandyti dar kartą' : 'Retry Submission'}
            </button>
          </div>
        `;
        document.getElementById('btn-alert-retry')?.addEventListener('click', () => {
          clearAlert();
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        });
      } else {
        alertBox.innerHTML = `<div>${msg}</div>`;
      }
      alertBox.style.display = 'block';
      alertBox.classList.add('visible');
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const clearAlert = () => {
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.classList.remove('visible');
      alertBox.innerHTML = '';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    // 1. Spam Prevention: Honeypot check
    const honeypot = form.elements['website_hp']?.value;
    if (honeypot) {
      form.style.display = 'none';
      successCard?.classList.add('visible');
      return;
    }

    // 2. Rate limiting (max 1 submission per 45s)
    const lastSubmitTime = localStorage.getItem('dp_last_submit_ts');
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime, 10) < 45000) {
      const waitSec = Math.ceil((45000 - (now - parseInt(lastSubmitTime, 10))) / 1000);
      showAlert(currentLang === 'lt'
        ? `Prašome palaukti ${waitSec} s. prieš siunčiant dar vieną užklausą.`
        : `Please wait ${waitSec}s before sending another submission.`
      );
      return;
    }

    const name = form.elements['name']?.value?.trim();
    const country = form.elements['country']?.value?.trim() || 'Global / Unspecified';
    const role = form.elements['role']?.value || 'Other';
    const type = form.elements['type']?.value || 'Film Idea';
    const contactType = form.elements['contactType']?.value || 'Email';
    const handle = form.elements['handle']?.value?.trim();
    const message = form.elements['message']?.value?.trim();
    const consent = form.elements['consent']?.checked;

    if (!name || !handle || !message) {
      showAlert(currentLang === 'lt' ? 'Prašome užpildyti visus privalomus laukus.' : 'Please fill in all required fields.');
      return;
    }

    if (!consent) {
      showAlert(currentLang === 'lt' 
        ? 'Prašome pažymėti sutikimą su privatumo politika.' 
        : 'Please accept the privacy policy consent checkbox to proceed.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = currentLang === 'lt' ? 'Siunčiama...' : 'Sending...';

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
        if (progressBar) progressBar.style.width = '30%';

        if (storage) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          storagePath = `${STORAGE_FOLDER}/${Date.now()}_${safeName}`;
          const storageReference = ref(storage, storagePath);

          try {
            const uploadTask = uploadBytesResumable(storageReference, file);

            await new Promise((resolve) => {
              const timeout = setTimeout(() => resolve(), 12000);

              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  if (snapshot.totalBytes > 0 && progressBar) {
                    const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    progressBar.style.width = `${Math.min(95, percent)}%`;
                  }
                },
                (err) => {
                  clearTimeout(timeout);
                  resolve();
                },
                async () => {
                  clearTimeout(timeout);
                  if (progressBar) progressBar.style.width = '100%';
                  try {
                    fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                  } catch (urlErr) {}
                  resolve();
                }
              );
            });
          } catch (storageErr) {
            console.warn('Storage upload notice:', storageErr);
          }
        }
      }

      // Base Submission Document
      const submissionDoc = {
        name,
        country,
        role,
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

      const escapeHtml = (str) => {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      // 1. Direct Firestore Atomic Batched Write (submissions + mail for Trigger Email Extension)
      if (db) {
        try {
          const batch = writeBatch(db);

          const submissionRef = doc(collection(db, FIRESTORE_COLLECTION));
          const firestoreDoc = {
            ...submissionDoc,
            createdAt: serverTimestamp()
          };
          batch.set(submissionRef, firestoreDoc);

          const attachmentLine = fileName 
            ? `Attachment: ${fileName} (${fileSizeBytes ? Math.round(fileSizeBytes / 1024) + ' KB' : 'Uploaded'})\nFile URL: ${fileUrl || '(Uploaded to Firebase Storage)'}` 
            : 'Attachment: None';

          const plainTextMessage = [
            `NEW FILM TEAM APPLICATION & PITCH — DP | FILMS`,
            `==================================================`,
            `Name:         ${name}`,
            `Country:      ${country}`,
            `Role:         ${role}`,
            `Project Type: ${type}`,
            `Contact Type: ${contactType}`,
            `Handle/Email: ${handle}`,
            `Language:     ${currentLang.toUpperCase()}`,
            `Submitted At: ${new Date().toUTCString()}`,
            attachmentLine,
            `--------------------------------------------------`,
            `APPLICATION / PITCH MESSAGE:`,
            message,
            `==================================================`
          ].join('\n');

          const htmlMessage = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; color: #111827; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
              <div style="border-bottom: 2px solid #113939; padding-bottom: 14px; margin-bottom: 20px;">
                <span style="font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #113939; font-weight: 700;">DP | FILMS — New Team Application</span>
                <h2 style="margin: 6px 0 0 0; font-size: 20px; color: #113939;">${escapeHtml(name)} — ${escapeHtml(role)} (${escapeHtml(country)})</h2>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                <tr><td style="padding: 7px 0; color: #6b7280; width: 140px; font-weight: 600;">Applicant Name:</td><td style="padding: 7px 0; color: #111827; font-weight: 600;">${escapeHtml(name)}</td></tr>
                <tr><td style="padding: 7px 0; color: #6b7280; font-weight: 600;">Role:</td><td style="padding: 7px 0; color: #113939; font-weight: 700;">${escapeHtml(role)}</td></tr>
                <tr><td style="padding: 7px 0; color: #6b7280; font-weight: 600;">Country / Location:</td><td style="padding: 7px 0; color: #111827;">${escapeHtml(country)}</td></tr>
                <tr><td style="padding: 7px 0; color: #6b7280; font-weight: 600;">Proposal Type:</td><td style="padding: 7px 0; color: #111827;">${escapeHtml(type)}</td></tr>
                <tr><td style="padding: 7px 0; color: #6b7280; font-weight: 600;">Contact Channel:</td><td style="padding: 7px 0; color: #111827;"><strong>${escapeHtml(contactType)}:</strong> ${escapeHtml(handle)}</td></tr>
                ${fileName ? `<tr><td style="padding: 7px 0; color: #6b7280; font-weight: 600;">Attachment:</td><td style="padding: 7px 0; color: #113939;">📄 ${escapeHtml(fileName)} ${fileUrl ? `(<a href="${escapeHtml(fileUrl)}" target="_blank" style="color: #113939; text-decoration: underline;">Open File</a>)` : ''}</td></tr>` : ''}
              </table>
              <div style="background-color: #f9fafb; border-left: 3px solid #113939; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Message / Pitch:</div>
                <div style="font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${escapeHtml(message)}</div>
              </div>
              <div style="font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px;">
                Triggered automatically via Firebase Extension <code>firestore-send-email</code> &middot; Recipient: info@dominikphotofficial.lt
              </div>
            </div>
          `;

          const mailRef = doc(collection(db, 'mail'));
          const mailDoc = {
            to: ["info@dominikphotofficial.lt"],
            message: {
              subject: `New film team application: ${name} (${role}, ${country})`,
              text: plainTextMessage,
              html: htmlMessage
            },
            submissionId: submissionRef.id,
            createdAt: serverTimestamp()
          };
          batch.set(mailRef, mailDoc);

          await batch.commit();
          saved = true;
          console.log('[DP FILMS] Batched write committed to submissions and mail.');
        } catch (fsErr) {
          console.warn('[DP FILMS] Firestore atomic batch write notice:', fsErr);
        }
      }

      // 2. Server backup copy
      try {
        const apiRes = await fetch('/api/submit-proposal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...submissionDoc,
            createdAt: new Date().toISOString()
          })
        });
        if (apiRes.ok) {
          saved = true;
        }
      } catch (apiErr) {
        console.warn('[DP FILMS] Server API notice:', apiErr);
      }

      if (!saved) {
        throw new Error('Nepavyko išsaugoti užklausos. Patikrinkite interneto ryšį.');
      }

      localStorage.setItem('dp_last_submit_ts', Date.now().toString());

      if (successDesc) {
        successDesc.textContent = currentLang === 'lt'
          ? `Ačiū, ${name}! Tavo paraiška (${role}) sėkmingai gauta. Dominik netrukus susisieks su tavimi.`
          : `Thank you, ${name}! Your application as ${role} has been received. Dominik will review your message and reply soon.`;
      }

      form.style.display = 'none';
      if (successCard) {
        successCard.style.display = 'flex';
        successCard.classList.add('visible');
      }
      if (progressBox) progressBox.style.display = 'none';

    } catch (err) {
      console.error('Submission failed:', err);
      
      let friendlyError = '';
      const errMsg = err?.message || String(err);

      if (errMsg.includes('offline') || !navigator.onLine) {
        friendlyError = currentLang === 'lt'
          ? 'Nėra interneto ryšio. Patikrinkite ryšį ir paspauskite „Bandyti dar kartą“.'
          : 'You appear to be offline. Please verify your connection and click Retry.';
      } else if (errMsg.includes('permission') || errMsg.includes('PERMISSION_DENIED')) {
        friendlyError = currentLang === 'lt'
          ? 'Laikinas saugumo taisyklių ryšio sutrikimas. Bandykite dar kartą arba susisiekite: info@dominikphotofficial.lt.'
          : 'Database security authorization issue. Please try again or email directly: info@dominikphotofficial.lt.';
      } else {
        friendlyError = currentLang === 'lt'
          ? 'Nepavyko išsaugoti duomenų bazėje. Patikrinkite ryšį ir bandykite dar kartą.'
          : 'Database write could not be completed. Please check your connection and retry.';
      }

      showAlert(friendlyError, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (progressBox) progressBox.style.display = 'none';
    }
  });
};

// ==========================================================================
// 6. CV Viewer PDF Fallback Check (about.html)
// ==========================================================================
export const initCvViewer = () => {
  const iframe = document.getElementById('cv-pdf-frame');
  const fallback = document.getElementById('cv-placeholder-fallback');
  if (!iframe || !fallback) return;

  fetch(iframe.getAttribute('src') || 'assets/cv.pdf', { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        iframe.style.display = 'block';
        fallback.style.display = 'none';
      } else {
        iframe.style.display = 'none';
        fallback.style.display = 'block';
      }
    })
    .catch(() => {
      iframe.style.display = 'none';
      fallback.style.display = 'block';
    });
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initVideoModal();
  initFilmsShowcase();
  initAwardsPage();
  initSubmissionForm();
  initCvViewer();
});
