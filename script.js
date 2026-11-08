// ==========================================================================
// DP | FILMS — Core Client Script
// Team Recruitment & Pitch Engine (Firestore + Direct Email Notification)
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig, filmsList, FIRESTORE_COLLECTION, STORAGE_FOLDER } from './config.js';

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
const initNavigation = () => {
  const header = document.querySelector('.header');
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  toggleBtn?.addEventListener('click', () => {
    navMenu?.classList.toggle('mobile-active');
  });

  // Close mobile nav on anchor link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('mobile-active');
    });
  });

  // Auto-fill role when clicking a role card CTA
  document.querySelectorAll('[data-select-role]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = btn.getAttribute('data-select-role');
      const roleSelect = document.getElementById('input-role');
      if (roleSelect && role) {
        roleSelect.value = role;
      }
    });
  });
};

// ==========================================================================
// 2. Video Modal Player
// ==========================================================================
const initVideoModal = () => {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  const frameHolder = document.getElementById('video-modal-frame-holder');

  if (!modal || !frameHolder) return;

  const openVideo = (youtubeId, title = '') => {
    if (!youtubeId) return;
    frameHolder.innerHTML = `
      <iframe 
        src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
        title="${title || 'DP FILMS Video'}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    frameHolder.innerHTML = '';
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', closeVideo);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideo();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeVideo();
    }
  });

  window.__dpOpenVideo = openVideo;

  document.querySelectorAll('.open-video-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const ytid = el.getAttribute('data-youtube-id') || 'bcLq-VXBpzI';
      openVideo(ytid, 'FROZEN TIME: WHAT IF');
    });
  });
};

// ==========================================================================
// 3. Render Films Showcase with Filter Chips
// ==========================================================================
const initFilmsShowcase = () => {
  const gridContainer = document.getElementById('films-grid-container');
  const countDisplay = document.getElementById('films-count-display');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (!gridContainer) return;

  const renderList = (filter = 'all') => {
    let filtered = [...filmsList];

    if (filter === 'awards') {
      filtered = filtered.filter(f => !!f.award);
    } else if (['2026', '2025', '2024'].includes(filter)) {
      filtered = filtered.filter(f => f.year === filter);
    }

    if (countDisplay) {
      countDisplay.textContent = currentLang === 'lt'
        ? `Rodoma: ${filtered.length} ${filtered.length === 1 ? 'filmas' : 'filmai'}`
        : `Showing: ${filtered.length} ${filtered.length === 1 ? 'film' : 'films'}`;
    }

    gridContainer.innerHTML = filtered.map(film => {
      const desc = film.desc ? (film.desc[currentLang] || film.desc.en) : '';
      const thumbUrl = `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`;
      const awardBadge = film.award ? `
        <div class="film-badge-award-small" title="${film.award}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          AISFF Winner
        </div>
      ` : '';

      return `
        <article class="film-card" data-year="${film.year}" data-id="${film.id}">
          <div class="film-thumbnail-wrapper" onclick="window.__dpOpenVideo('${film.youtubeId}', '${film.title.replace(/'/g, "\\'")}')" role="button" tabindex="0" aria-label="${currentLang === 'lt' ? 'Žiūrėti filmą' : 'Watch film'} ${film.title}">
            <img src="${thumbUrl}" alt="${film.title}" loading="lazy" width="480" height="270">
            <span class="film-badge-year">${film.year}</span>
            ${awardBadge}
            <div class="film-play-btn">
              <div class="film-play-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
          <div class="film-card-content">
            <h3 class="film-card-title">${film.title}</h3>
            ${film.specs ? `<p class="film-card-specs">${film.specs}</p>` : ''}
            <p class="film-card-desc">${desc}</p>
            <div class="film-card-footer">
              <button type="button" class="film-link-watch" onclick="window.__dpOpenVideo('${film.youtubeId}', '${film.title.replace(/'/g, "\\'")}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                ${currentLang === 'lt' ? 'Žiūrėti filmą' : 'Watch Film'}
              </button>
              <a href="https://youtu.be/${film.youtubeId}" target="_blank" rel="noopener noreferrer" class="film-yt-badge">
                YouTube ↗
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  };

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter') || 'all';
      renderList(filter);
    });
  });

  renderList('all');
};

// ==========================================================================
// 4. Application Form & Submissions Engine
// ==========================================================================
const initSubmissionForm = () => {
  const form = document.getElementById('submission-form');
  const fileInput = document.getElementById('input-file');
  const dropZone = document.getElementById('file-drop-zone');
  const fileInfoBadge = document.getElementById('file-info-badge');
  const fileNameDisplay = document.getElementById('file-name-display');
  const fileRemoveBtn = document.getElementById('file-remove-btn');
  const alertBox = document.getElementById('form-alert-box');
  const successCard = document.getElementById('form-success-card');
  const successDesc = document.getElementById('form-success-desc');
  const resetBtn = document.getElementById('form-reset-btn');
  const submitBtn = document.getElementById('form-submit-btn');
  const progressBox = document.getElementById('upload-progress-box');
  const progressBar = document.getElementById('upload-progress-bar');

  if (!form) return;

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  let currentFile = null;

  const showAlert = (msg) => {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.classList.add('visible');
  };

  const clearAlert = () => {
    if (!alertBox) return;
    alertBox.textContent = '';
    alertBox.classList.remove('visible');
  };

  const updateFileDisplay = (file) => {
    currentFile = file;
    if (file) {
      if (fileNameDisplay) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        fileNameDisplay.textContent = `${file.name} (${sizeMb} MB)`;
      }
      fileInfoBadge?.classList.add('active');
      dropZone?.classList.add('has-file');
    } else {
      fileInfoBadge?.classList.remove('active');
      dropZone?.classList.remove('has-file');
      if (fileInput) fileInput.value = '';
    }
  };

  dropZone?.addEventListener('click', () => {
    fileInput?.click();
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone?.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone?.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        showAlert(currentLang === 'lt' ? 'Failas viršija 25 MB limitą.' : 'File exceeds 25 MB limit.');
        return;
      }
      clearAlert();
      updateFileDisplay(file);
    }
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showAlert(currentLang === 'lt' ? 'Failas viršija 25 MB limitą.' : 'File exceeds 25 MB limit.');
        updateFileDisplay(null);
        return;
      }
      clearAlert();
      updateFileDisplay(file);
    }
  });

  fileRemoveBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateFileDisplay(null);
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    updateFileDisplay(null);
    clearAlert();
    successCard?.classList.remove('visible');
    form.style.display = 'flex';
  });

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Form submission handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    // 1. Spam Prevention: Honeypot check
    const honeypot = form.elements['website_hp']?.value;
    if (honeypot) {
      console.warn('Bot submission prevented.');
      form.style.display = 'none';
      successCard?.classList.add('visible');
      return;
    }

    // 2. Spam Prevention: Rate limiting via localStorage (max 1 submission per 45s)
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
    const type = form.elements['type']?.value || 'Join the Film Team';
    const contactType = form.elements['contactType']?.value || 'Email';
    const handle = form.elements['handle']?.value?.trim();
    const message = form.elements['message']?.value?.trim();

    if (!name || !handle || !message) {
      showAlert(currentLang === 'lt' ? 'Prašome užpildyti visus privalomus laukus.' : 'Please fill in all required fields.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = currentLang === 'lt' ? 'Siunčiama...' : 'Sending...';

    try {
      let fileUrl = null;
      let fileDataUrl = null;
      let fileName = null;
      let fileSizeBytes = null;
      let storageMethod = null;
      let storagePath = null;

      const file = currentFile || fileInput?.files?.[0];

      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;

        if (progressBox) progressBox.style.display = 'block';
        if (progressBar) progressBar.style.width = '30%';

        // Base64 fallback for files up to 10 MB for resilience
        if (file.size <= 10 * 1024 * 1024) {
          try {
            fileDataUrl = await readFileAsDataURL(file);
          } catch (readErr) {
            console.warn('Base64 read notice:', readErr);
          }
        }

        if (storage) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          storagePath = `${STORAGE_FOLDER}/${Date.now()}_${safeName}`;
          const storageReference = ref(storage, storagePath);

          try {
            const uploadTask = uploadBytesResumable(storageReference, file);

            await new Promise((resolve) => {
              const timeout = setTimeout(() => {
                console.warn('Storage upload timeout, proceeding with payload');
                resolve();
              }, 12000);

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
                  console.warn('Storage notice:', err?.message || err);
                  resolve();
                },
                async () => {
                  clearTimeout(timeout);
                  if (progressBar) progressBar.style.width = '100%';
                  try {
                    fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    storageMethod = 'firebase_storage';
                  } catch (urlErr) {
                    storageMethod = 'firebase_storage_ref';
                  }
                  resolve();
                }
              );
            });
          } catch (storageErr) {
            console.warn('Storage upload notice:', storageErr);
          }
        }
      }

      // Base Submission Document (Standardized format)
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
        storagePath: storagePath || null
      };

      if (fileUrl) {
        submissionDoc.fileUrl = fileUrl;
        submissionDoc.storageMethod = storageMethod || 'firebase_storage';
      } else if (fileDataUrl) {
        submissionDoc.fileDataUrl = fileDataUrl;
        submissionDoc.storageMethod = 'direct_base64';
      }

      let saved = false;

      // 1. Direct Firestore write
      if (db) {
        try {
          const firestoreDoc = {
            ...submissionDoc,
            createdAt: serverTimestamp()
          };
          await addDoc(collection(db, FIRESTORE_COLLECTION), firestoreDoc);
          saved = true;
          console.log('[DP FILMS] Submission successfully written to Firestore.');
        } catch (fsErr) {
          console.warn('[DP FILMS] Firestore direct write notice:', fsErr?.message || fsErr);
        }
      }

      // 2. Local Express server backup & sync
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

      // 3. Optional Direct FormSubmit notification if configured (Free email notification without backend)
      try {
        const notifyPayload = {
          name,
          country,
          role,
          proposal_type: type,
          contact: `${contactType}: ${handle}`,
          message,
          _subject: `[DP FILMS Team Application] ${name} (${role} - ${country})`
        };
        // Non-blocking notification ping
        fetch('https://formsubmit.co/ajax/info@dominikphotofficial.lt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(notifyPayload)
        }).catch(() => {});
      } catch (notifyErr) {
        // Notification is non-fatal
      }

      if (!saved) {
        throw new Error('Nepavyko išsaugoti užklausos. Patikrinkite interneto ryšį.');
      }

      // Record timestamp for rate limiting
      localStorage.setItem('dp_last_submit_ts', Date.now().toString());

      // Show Success State
      if (successDesc) {
        if (fileName) {
          successDesc.textContent = currentLang === 'lt'
            ? `Ačiū, ${name}! Tavo paraiška (${role}) ir failas (${fileName}) sėkmingai gauti. Dominik netrukus susisieks su tavimi.`
            : `Thank you, ${name}! Your application as ${role} and attachment (${fileName}) were received. Dominik will get back to you shortly.`;
        } else {
          successDesc.textContent = currentLang === 'lt'
            ? `Ačiū, ${name}! Tavo paraiška (${role}) sėkmingai gauta. Dominik netrukus peržiūrės ją ir susisieks.`
            : `Thank you, ${name}! Your application as ${role} has been received. Dominik will review your message and reply soon.`;
        }
      }

      form.style.display = 'none';
      successCard?.classList.add('visible');
      if (progressBox) progressBox.style.display = 'none';

    } catch (err) {
      console.error('Submission failed:', err);
      showAlert(currentLang === 'lt'
        ? 'Klaida siunčiant formą. Prašome susisiekti tiesiogiai el. paštu info@dominikphotofficial.lt arba Telegram.'
        : 'Error sending your application. Please contact directly via info@dominikphotofficial.lt or Telegram.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (progressBox) progressBox.style.display = 'none';
    }
  });
};

// ==========================================================================
// 5. Language Switcher
// ==========================================================================
const initLanguageSwitcher = () => {
  document.querySelectorAll('.lang-switcher a').forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('/lt') || href.includes('/lt')) {
        try { localStorage.setItem('dp_film_language_pref', 'lt'); } catch(e) {}
      } else {
        try { localStorage.setItem('dp_film_language_pref', 'en'); } catch(e) {}
      }
    });
  });
};

// ==========================================================================
// Initialize on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initVideoModal();
  initFilmsShowcase();
  initSubmissionForm();
  initLanguageSwitcher();
});
