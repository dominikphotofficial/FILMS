// ==========================================================================
// DP | FILMS — Core Client Script
// Minimalist Cinematic Portfolio & Firebase Submission Engine
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig, filmsList, contactLinks } from './config.js';

// Detect language from HTML lang attribute
const lang = document.documentElement.lang === 'en' ? 'en' : 'lt';

// Initialize Firebase
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
    // If anonymous auth is not enabled in Firebase Console, silently continue
    console.debug('Firebase Auth note:', authErr?.message || authErr);
  });
} catch (err) {
  console.warn('Firebase initialization warning:', err);
}

// ==========================================================================
// 1. Intersection Observer for Scroll Reveals ('fade-in-up')
// ==========================================================================
const initScrollReveal = () => {
  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
};

// ==========================================================================
// 2. Render Stacked Films List with Lazy YouTube Embeds
// ==========================================================================
const renderFilms = () => {
  const container = document.getElementById('films-stack');
  if (!container) return;

  container.innerHTML = filmsList.map((film, index) => {
    const descText = film.desc ? (film.desc[lang] || film.desc.lt) : '';
    const awardBadge = film.award
      ? `<div class="film-award">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
           <span>${film.award}</span>
         </div>`
      : '';

    return `
      <article class="film-item reveal" data-video-id="${film.youtubeId}">
        <div class="film-header">
          <div class="film-title-wrap">
            <h3 class="film-title">${film.title}</h3>
            <div class="film-meta">
              <span>${film.year}</span>
              <span aria-hidden="true">·</span>
              <span>${film.specs}</span>
            </div>
          </div>
          ${awardBadge}
        </div>

        <div class="video-container" id="video-frame-${film.id}">
          <img 
            class="video-poster" 
            src="https://img.youtube.com/vi/${film.youtubeId}/hqdefault.jpg" 
            alt="${film.title}" 
            loading="${index === 0 ? 'eager' : 'lazy'}"
            onerror="this.src='https://img.youtube.com/vi/${film.youtubeId}/mqdefault.jpg'"
          />
          <button type="button" class="video-play-btn" aria-label="Play ${film.title}">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>

        ${descText ? `<p class="film-desc">${descText}</p>` : ''}
      </article>
    `;
  }).join('');

  // Attach click-to-play handlers on video containers
  container.querySelectorAll('.film-item').forEach(item => {
    const videoId = item.getAttribute('data-video-id');
    const containerEl = item.querySelector('.video-container');
    const playBtn = item.querySelector('.video-play-btn');
    const poster = item.querySelector('.video-poster');

    const loadVideo = () => {
      if (containerEl.dataset.loaded) return;
      containerEl.dataset.loaded = 'true';
      containerEl.innerHTML = `
        <iframe 
          src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0" 
          title="Video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen>
        </iframe>
      `;
    };

    if (playBtn) playBtn.addEventListener('click', loadVideo);
    if (poster) poster.addEventListener('click', loadVideo);
  });
};

// ==========================================================================
// 3. Render Contacts Section
// ==========================================================================
const renderContacts = () => {
  const container = document.getElementById('contacts-grid');
  if (!container) return;

  const items = [
    contactLinks.instagram,
    contactLinks.telegram,
    contactLinks.whatsapp,
    contactLinks.messenger
  ];

  container.innerHTML = items.map(item => `
    <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="contact-card reveal">
      <div class="contact-info">
        <span class="contact-name">${item.label}</span>
        <span class="contact-handle">${item.handle}</span>
      </div>
      <span class="contact-badge">${item.badge}</span>
    </a>
  `).join('');
};

// ==========================================================================
// 4. Form Submission & File Upload with Fallback Handling
// ==========================================================================
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_BASE64_SIZE = 750 * 1024; // 750 KB direct Firestore fallback

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const initForm = () => {
  const form = document.getElementById('idea-form');
  if (!form) return;

  const fileInput = document.getElementById('form-file');
  const fileInfo = document.getElementById('file-selected-info');
  const fileNameDisplay = document.getElementById('file-name-display');
  const alertBox = document.getElementById('form-alert');
  const submitBtn = document.getElementById('form-submit-btn');
  const progressBox = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const successCard = document.getElementById('form-success-card');
  const successDesc = successCard?.querySelector('.form-success-desc');
  const resetBtn = document.getElementById('btn-submit-another');

  const defaultSuccessText = successDesc ? successDesc.textContent.trim() : '';

  const showAlert = (message) => {
    alertBox.textContent = message;
    alertBox.classList.add('visible', 'form-alert-error');
  };

  const clearAlert = () => {
    alertBox.textContent = '';
    alertBox.classList.remove('visible', 'form-alert-error');
  };

  // File selection & validation
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      clearAlert();
      const file = fileInput.files[0];
      if (!file) {
        fileInfo.classList.remove('visible');
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const errText = lang === 'lt'
          ? `Pasirinktas failas (${formatBytes(file.size)}) viršija 25 MB limitą. Prašome pasirinkti mažesnį failą.`
          : `Selected file (${formatBytes(file.size)}) exceeds the 25 MB limit. Please select a smaller file.`;
        showAlert(errText);
        fileInput.value = '';
        fileInfo.classList.remove('visible');
        return;
      }

      fileNameDisplay.textContent = `${file.name} (${formatBytes(file.size)})`;
      fileInfo.classList.add('visible');
    });
  }

  // Reset form handler
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      fileInfo.classList.remove('visible');
      clearAlert();
      if (successDesc && defaultSuccessText) {
        successDesc.textContent = defaultSuccessText;
      }
      successCard.classList.remove('visible');
      form.style.display = 'flex';
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const name = form.elements['name']?.value?.trim();
    const contactType = form.elements['contactType']?.value;
    const handle = form.elements['handle']?.value?.trim();
    const type = form.elements['type']?.value;
    const message = form.elements['message']?.value?.trim();
    const file = fileInput?.files?.[0];

    // Validation
    if (!name || !contactType || !handle || !type || !message) {
      showAlert(lang === 'lt' ? 'Prašome užpildyti visus privalomus laukus.' : 'Please fill in all required fields.');
      return;
    }

    if (file && file.size > MAX_FILE_SIZE) {
      showAlert(lang === 'lt' ? 'Failas viršija 25 MB limitą.' : 'File exceeds 25 MB limit.');
      return;
    }

    if (!db) {
      showAlert(lang === 'lt' ? 'Duomenų bazės ryšio klaida. Bandykite vėliau.' : 'Database connection error. Please try again later.');
      return;
    }

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = lang === 'lt' ? 'Siunčiama...' : 'Sending...';

    try {
      let fileUrl = null;
      let fileDataUrl = null;
      let fileName = null;
      let fileSizeBytes = null;
      let fileStorageNote = null;

      // Handle file if attached
      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;

        // Try ensuring anonymous auth before Storage upload
        if (auth && !auth.currentUser) {
          try {
            await signInAnonymously(auth);
          } catch (authErr) {
            console.debug('Anonymous auth sign-in note:', authErr?.message || authErr);
          }
        }

        let uploadSucceeded = false;

        // 1. Try uploading to Firebase Storage
        if (storage) {
          progressBox.style.display = 'block';
          progressBar.style.width = '15%';

          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const storagePath = `submissions/${Date.now()}_${safeName}`;
          const storageReference = ref(storage, storagePath);

          try {
            const uploadTask = uploadBytesResumable(storageReference, file);

            await new Promise((resolve, reject) => {
              const uploadTimeout = setTimeout(() => {
                reject(new Error('Storage upload timeout'));
              }, 20000);

              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  if (snapshot.totalBytes > 0) {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    progressBar.style.width = `${Math.min(95, Math.round(progress))}%`;
                  }
                },
                (error) => {
                  clearTimeout(uploadTimeout);
                  reject(error);
                },
                async () => {
                  clearTimeout(uploadTimeout);
                  progressBar.style.width = '100%';
                  try {
                    fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    uploadSucceeded = true;
                    resolve();
                  } catch (urlErr) {
                    reject(urlErr);
                  }
                }
              );
            });
          } catch (storageErr) {
            console.warn('Firebase Storage upload warning (activating resilient fallback):', storageErr?.message || storageErr);
            fileStorageNote = storageErr?.code || 'storage_upload_restricted';
          }
        }

        // 2. Direct fallback for documents <= 750 KB (CVs, scripts, text, PDFs)
        // Stores document directly in Firestore as base64 so submissions are never blocked
        if (!uploadSucceeded && file.size <= MAX_BASE64_SIZE) {
          try {
            progressBar.style.width = '90%';
            fileDataUrl = await readFileAsDataURL(file);
            uploadSucceeded = true;
            fileStorageNote = 'saved_in_firestore_base64';
          } catch (readErr) {
            console.warn('Base64 read fallback error:', readErr);
          }
        }
      }

      // Add document to Firestore 'submissions' collection
      const submissionDoc = {
        name,
        contactType,
        handle,
        type,
        message,
        fileName: fileName || null,
        fileSizeBytes: fileSizeBytes || null,
        fileMimeType: file?.type || null,
        lang,
        createdAt: serverTimestamp()
      };

      if (fileUrl) {
        submissionDoc.fileUrl = fileUrl;
        submissionDoc.storageMethod = 'firebase_storage';
      } else if (fileDataUrl) {
        submissionDoc.fileDataUrl = fileDataUrl;
        submissionDoc.storageMethod = 'firestore_direct_base64';
      } else if (file) {
        submissionDoc.storageMethod = 'metadata_only';
        submissionDoc.fileUploadStatus = fileStorageNote || 'unauthorized';
      }

      await addDoc(collection(db, 'submissions'), submissionDoc);

      // Customize success message based on file upload result
      if (successDesc) {
        if (file && (fileUrl || fileDataUrl)) {
          successDesc.textContent = lang === 'lt'
            ? `Dėkoju už jūsų idėją! Informacija bei prisegtas failas (${fileName}) sėkmingai išsaugoti. Peržiūrėsiu medžiagą ir netrukus susisieksiu jūsų nurodytu kontaktu.`
            : `Thank you for sharing your concept! Your proposal and attached file (${fileName}) have been safely received. Dominik will review the materials and get in touch with you shortly.`;
        } else if (file && fileStorageNote) {
          successDesc.textContent = lang === 'lt'
            ? `Dėkoju už jūsų idėją! Jūsų pranešimas sėkmingai išsaugotas. Kadangi saugykla šiuo metu riboja didelių failų įkėlimą, papildomai atsiųskite failą per pasirinktą kontaktą (${contactType}: ${handle}).`
            : `Thank you for your proposal! Your message has been safely saved. Since storage write permissions are currently restricted for large files, please also send the file directly via your chosen contact (${contactType}: ${handle}).`;
        } else if (defaultSuccessText) {
          successDesc.textContent = defaultSuccessText;
        }
      }

      // Show success state
      form.style.display = 'none';
      successCard.classList.add('visible');
      progressBox.style.display = 'none';
      progressBar.style.width = '0%';
    } catch (err) {
      console.error('Submission failed:', err);
      showAlert(
        lang === 'lt'
          ? 'Klaida siunčiant duomenis. Patikrinkite ryšį arba susisiekite tiesiogiai per nurodytus kontaktus.'
          : 'Error sending proposal. Please check your connection or contact directly via the contacts below.'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      progressBox.style.display = 'none';
    }
  });
};

// ==========================================================================
// Initialization on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderFilms();
  renderContacts();
  initForm();
  initScrollReveal();
});
