// ==========================================================================
// DP | FILMS — Core Client Script
// Minimalist Cinematic Portfolio & Firebase Submission Engine
// Accent: #113939 | Jost Typography
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig, filmsList, FIRESTORE_COLLECTION, STORAGE_FOLDER } from './config.js';

// Detect language from HTML lang attribute
const lang = document.documentElement.lang === 'en' ? 'en' : 'lt';

// Initialize Firebase client
let app = null;
let db = null;
let storage = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);

  // Background anonymous sign-in to satisfy authenticated Storage rules if enabled
  signInAnonymously(auth).catch((authErr) => {
    console.debug('Firebase Auth note:', authErr?.message || authErr);
  });
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

// ==========================================================================
// 1. Navigation & Tab Switcher
// ==========================================================================
const initTabs = () => {
  const tabButtons = document.querySelectorAll('.nav-tab-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const jumpButtons = document.querySelectorAll('[data-jump-tab]');

  const activateTab = (tabId) => {
    // Update button states
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab-target') === tabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Update pane states
    tabPanes.forEach(pane => {
      const isTarget = pane.id === `tab-${tabId}`;
      pane.classList.toggle('active', isTarget);
    });

    // Update URL hash smoothly without jump
    if (window.location.hash !== `#${tabId}`) {
      history.replaceState(null, '', `#${tabId}`);
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-tab-target');
      if (target) {
        activateTab(target);
        // If below header, smooth scroll to content area
        const contentArea = document.querySelector('.tab-content-area');
        if (contentArea && window.scrollY > 300) {
          contentArea.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  jumpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-jump-tab');
      if (target) {
        activateTab(target);
        const targetElement = document.getElementById(`tab-${target}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Handle initial hash in URL
  const initialHash = window.location.hash.replace('#', '');
  if (['films', 'about', 'idea', 'contacts'].includes(initialHash)) {
    activateTab(initialHash);
  }
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

  // Attach to global window for dynamic cards
  window.__dpOpenVideo = openVideo;

  // Listen to static featured buttons
  document.querySelectorAll('.open-video-btn, .featured-video-preview').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const ytid = el.getAttribute('data-youtube-id') || 'bcLq-VXBpzI';
      openVideo(ytid, 'FROZEN TIME: WHAT IF');
    });
  });
};

// ==========================================================================
// 3. Render Films Showcase with Filtering
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
      countDisplay.textContent = lang === 'lt'
        ? `Rodoma: ${filtered.length} ${filtered.length === 1 ? 'filmas' : 'filmai'}`
        : `Showing: ${filtered.length} ${filtered.length === 1 ? 'film' : 'films'}`;
    }

    gridContainer.innerHTML = filtered.map(film => {
      const desc = film.desc ? (film.desc[lang] || film.desc.lt) : '';
      const thumbUrl = `https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg`;
      const awardBadge = film.award ? `
        <div class="film-badge-award-small" title="${film.award}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          AISFF Winner
        </div>
      ` : '';

      return `
        <article class="film-card" data-year="${film.year}" data-id="${film.id}">
          <div class="film-thumbnail-wrapper" onclick="window.__dpOpenVideo('${film.youtubeId}', '${film.title.replace(/'/g, "\\'")}')" role="button" tabindex="0" aria-label="${lang === 'lt' ? 'Žiūrėti filmą' : 'Watch film'} ${film.title}">
            <img src="${thumbUrl}" alt="${film.title}" loading="lazy" width="480" height="270">
            <span class="film-badge-year">${film.year}</span>
            ${awardBadge}
            <div class="film-play-btn">
              <div class="film-play-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
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
                ${lang === 'lt' ? 'Žiūrėti filmą' : 'Watch Film'}
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

  // Filter click events
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.getAttribute('data-filter') || 'all';
      renderList(filter);
    });
  });

  // Initial render
  renderList('all');
};

// ==========================================================================
// 4. File Upload & Submissions Engine
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
  const MAX_BASE64_SIZE = 750 * 1024; // 750 KB for base64 direct fallback

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

  // Drag and drop events
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
        showAlert(lang === 'lt' ? 'Failas viršija 25 MB limitą.' : 'File exceeds 25 MB limit.');
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
        showAlert(lang === 'lt' ? 'Failas viršija 25 MB limitą.' : 'File exceeds 25 MB limit.');
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

  // Read file as Base64 helper for offline/resilient storage
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

    const name = form.elements['name']?.value?.trim();
    const type = form.elements['type']?.value;
    const contactType = form.elements['contactType']?.value;
    const handle = form.elements['handle']?.value?.trim();
    const message = form.elements['message']?.value?.trim();

    if (!name || !type || !contactType || !handle || !message) {
      showAlert(lang === 'lt' ? 'Prašome užpildyti visus privalomus laukus.' : 'Please fill in all required fields.');
      return;
    }

    if (!db) {
      showAlert(lang === 'lt' ? 'Duomenų bazės ryšio klaida. Bandykite vėliau.' : 'Database connection error. Please try again later.');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = lang === 'lt' ? 'Siunčiama...' : 'Sending...';

    try {
      let fileUrl = null;
      let fileDataUrl = null;
      let fileName = null;
      let fileSizeBytes = null;
      let storageMethod = null;

      const file = currentFile || fileInput?.files?.[0];

      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;

        if (auth && !auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (authErr) {
            console.debug('Auth note:', authErr?.message || authErr);
          }
        }

        let uploadSuccess = false;

        // Try Firebase Storage first
        if (storage) {
          if (progressBox) progressBox.style.display = 'block';
          if (progressBar) progressBar.style.width = '20%';

          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const storagePath = `${STORAGE_FOLDER}/${Date.now()}_${safeName}`;
          const storageReference = ref(storage, storagePath);

          try {
            const uploadTask = uploadBytesResumable(storageReference, file);

            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('Storage upload timeout')), 22000);

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
                  reject(err);
                },
                async () => {
                  clearTimeout(timeout);
                  if (progressBar) progressBar.style.width = '100%';
                  try {
                    fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    uploadSuccess = true;
                    storageMethod = 'firebase_storage';
                    resolve();
                  } catch (urlErr) {
                    reject(urlErr);
                  }
                }
              );
            });
          } catch (storageErr) {
            console.warn('Storage upload notice (using fallback):', storageErr?.message || storageErr);
          }
        }

        // Direct base64 fallback for documents up to 750KB
        if (!uploadSuccess && file.size <= MAX_BASE64_SIZE) {
          try {
            fileDataUrl = await readFileAsDataURL(file);
            uploadSuccess = true;
            storageMethod = 'firestore_direct_base64';
          } catch (baseErr) {
            console.warn('Base64 fallback notice:', baseErr);
          }
        }

        if (!uploadSuccess) {
          storageMethod = 'metadata_only';
        }
      }

      // Submission Document
      const submissionDoc = {
        name,
        type,
        contactType,
        handle,
        message,
        status: 'new', // new | read | replied | archived
        unread: true,
        lang,
        createdAt: serverTimestamp(),
        fileName: fileName || null,
        fileSizeBytes: fileSizeBytes || null,
        fileMimeType: file?.type || null
      };

      if (fileUrl) {
        submissionDoc.fileUrl = fileUrl;
        submissionDoc.storageMethod = storageMethod || 'firebase_storage';
      } else if (fileDataUrl) {
        submissionDoc.fileDataUrl = fileDataUrl;
        submissionDoc.storageMethod = 'firestore_direct_base64';
      } else if (file) {
        submissionDoc.storageMethod = 'metadata_only';
      }

      // Add to Firestore collection film_submissions
      await addDoc(collection(db, FIRESTORE_COLLECTION), submissionDoc);

      // Customize success message
      if (successDesc) {
        if (fileName && (fileUrl || fileDataUrl)) {
          successDesc.textContent = lang === 'lt'
            ? `Dėkoju už pasiūlymą! Pranešimas ir prisegtas failas (${fileName}) sėkmingai išsaugoti. Dominik netrukus susisieks jūsų nurodytu kontaktu.`
            : `Thank you for sharing your concept! Your message and attached file (${fileName}) have been safely received. Dominik will be in touch shortly.`;
        } else {
          successDesc.textContent = lang === 'lt'
            ? 'Dėkoju už jūsų idėją! Dominik peržiūrės medžiagą ir susisieks jūsų nurodytu kontaktu.'
            : 'Thank you for your proposal! Dominik will review the materials and reach out via your preferred contact channel.';
        }
      }

      form.style.display = 'none';
      successCard?.classList.add('visible');
      if (progressBox) progressBox.style.display = 'none';
    } catch (err) {
      console.error('Submission failed:', err);
      showAlert(lang === 'lt'
        ? 'Klaida siunčiant pasiūlymą. Patikrinkite ryšį arba parašykite tiesiogiai per kontaktus.'
        : 'Error submitting proposal. Please check your connection or contact directly via social channels.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      if (progressBox) progressBox.style.display = 'none';
    }
  });
};

// ==========================================================================
// Initialize Everything on DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initVideoModal();
  initFilmsShowcase();
  initSubmissionForm();
});
