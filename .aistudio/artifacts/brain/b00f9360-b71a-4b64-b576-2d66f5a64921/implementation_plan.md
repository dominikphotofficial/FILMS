# DP | FILMS — Cinematic Minimalist Portfolio Reversion & Submission Engine

Reverting the **DP | FILMS** website from the desktop/OS-style interface back to a clean, professional, and minimalist cinematic portfolio website for videographer, photographer, and filmmaker Dominik Šuškevič. The site incorporates the 5 requested sections (Hero with motto, Films stacked showcase, About, Idea/Script submission form with Firebase integration, and Contacts), bilingual support (Lithuanian at `/index.html` and English at `/en/index.html`), and removes all obsolete OS desktop files.

## User Review & Critical Decisions

> [!IMPORTANT]
> The desktop OS paradigm (windows, dock, desktop icons, fake boot screens) is completely discarded. The site returns to a real, editorial cinematic website with grotesque typography, disciplined spacing, and zero superfluous elements.

- **Confirmed Films Presentation**: Cinematic stacked list with prominent, high-fidelity responsive video embeds lazy-loaded on interaction/scroll to maximize initial page performance.
- **Confirmed Contacts Presentation**: Minimalist text links with direct chat badges for Instagram, Telegram, WhatsApp, and Messenger, managed via clear placeholders in `config.js`.
- **Branding & Visual Motto**: Exact wordmark `DP | FILMS` (uppercase DP, hairline vertical divider `|`, uppercase FILMS) paired with the visual motto:
  - LT: `ERDVĖ. ŠVIESA. EMOCIJA.`
  - EN: `SPACE. LIGHT. EMOTION.`
- **Photography Handling**: No photos in the main film feed; instead, an elegant editorial link directs visitors to `portfolio.dominikphotofficial.lt`.
- **Idea & Script Form with Firebase**: Full submission form with 25MB file upload capability connecting directly to project `tfp-form` (Firestore collection `submissions` and Firebase Storage bucket `tfp-form.firebasestorage.app`). No confirmation email sending; immediate clean visual confirmation state.
- **Ready-to-Paste Security Rules**: Ready-to-copy Firestore and Storage rules enforcing strict write-only limits (size, allowed fields, 25MB ceiling) and zero public read/list/delete access.

---

## 1. Overview & Core Concept

- **What It Does**: A focused, high-impact cinema portfolio that presents Dominik's filmography, artistic philosophy, and a direct channel for directors, screenwriters, and festival entrants to submit project proposals and screenplays with attachments.
- **Target Audience**: Film festival programmers, indie directors, commercial clients, collaborators, and student filmmakers.
- **Key Value**: Strips away gimmickry to showcase raw cinematography, narrative works, and direct communication in a lightweight, lightning-fast bilingual web experience.

---

## 2. User Experience & Visual Design

### The 5 Core Sections

```
┌─────────────────────────────────────────────────────────────┐
│  Top Bar: DP | FILMS               [Films] [About] [Idea] [LT/EN]
├─────────────────────────────────────────────────────────────┤
│  1. HERO                                                    │
│     DP | FILMS                                              │
│     ERDVĖ. ŠVIESA. EMOCIJA.                                 │
├─────────────────────────────────────────────────────────────┤
│  2. FILMS (Stacked Cinematic List)                          │
│     • FROZEN TIME: WHAT IF (AISFF 1st Place) [Video Embed]  │
│     • WINTER SERIES (Cirkliškis, Šventa, Kauno Marios)       │
│     • NARRATIVE & SHORTS (The Village, Mikio Kelionė, EXIT) │
│     → Link to Photography (portfolio.dominikphotofficial.lt)│
├─────────────────────────────────────────────────────────────┤
│  3. ABOUT                                                   │
│     Concise statement: Cinematography · Videography · Directing
│     Continuous search for light, timing, and raw emotion.   │
├─────────────────────────────────────────────────────────────┤
│  4. SEND AN IDEA / SCRIPT (Form)                            │
│     [Name] [Contact Channel & Handle] [Submission Type]     │
│     [Message] [File Upload up to 25MB] [Submit Button]      │
├─────────────────────────────────────────────────────────────┤
│  5. CONTACTS                                                │
│     Instagram · Telegram · WhatsApp · Messenger             │
│     info@dominikphotofficial.lt                             │
└─────────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme
- **Aesthetic Direction**: High-contrast minimalist cinematic editorial. Pure, quiet, and intentional, inspired by European arthouse cinema monographs.
- **Color Palette (60-30-10 Rule)**:
  - **60% Dominant Neutral Canvas**: Stark obsidian jet black (`#070909` to `#0A0D0D`).
  - **30% Structural Surfaces**: Deep graphite containers (`#111616`), hairline borders (`rgba(255, 255, 255, 0.08)`), muted typography (`#94A3B8`).
  - **10% Accent**: Deep anamorphic cinema teal (`#113939`) and crisp high-contrast off-white accents (`#F1F5F9`).
- **Typography**: Grotesque sans-serif hierarchy (Inter / Space Grotesk / Helvetica feel) with tight tracking, balanced headline wrapping, and unboxed metadata.
- **Interaction Motion**: Refined `fade-in-up` scroll reveals via Intersection Observer API, smooth hover states ($\le 200\text{ms}$), and real-time upload progress feedback.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Discard Desktop OS in Favor of Pure Web Architecture**
  - *Chosen Approach*: Pure static HTML/CSS/JS served directly, without desktop drag physics or window managers.
  - *Why*: User explicitly requested reverting to the clean, professional website style. Eliminates heavy JS execution, increases mobile readability, and centers attention on the films.
- **Decision 2: Direct Client-Side Firebase Integration for Submissions**
  - *Chosen Approach*: Firebase Web SDK (v10 modular via ESM CDN) initialized directly with the user's provided `tfp-form` configuration.
  - *Why*: Instant, serverless submissions directly to Firestore and Firebase Storage. No backend email relay, no API keys to proxy through server endpoints, and zero maintenance overhead.
- **Decision 3: Strict 25MB Client & Rule-Level File Validation**
  - *Chosen Approach*: Pre-upload file validation checking file size ($\le 25\text{ MB}$) and generating a sanitized timestamped path in Storage (`submissions/{timestamp}_{filename}`).
  - *Why*: Protects against denial-of-wallet and quota exhaustion while accepting all creative file types (PDF, Final Draft, DOCX, TXT, ZIP).
- **Decision 4: Bilingual Page Structure (`/` and `/en`)**
  - *Chosen Approach*: Native Lithuanian at `/index.html` (default) and English at `/en/index.html`. Both share `style.css`, `config.js`, and `script.js` with language detection.
  - *Why*: Complies with standard search engine optimization, eliminates flash of unlocalized content, and allows direct bookmarking.

---

## 4. Technical Architecture & Data Strategy

### System & Submission Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Browser Client (index.html / en/index.html)                 │
│                                                             │
│ ┌────────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│ │ YouTube Embeds │  │ config.js     │  │ Submission Form  │ │
│ │ (Lazy-loaded)  │  │ (Films/Social)│  │ (Validation & UI)│ │
│ └────────────────┘  └───────────────┘  └────────┬─────────┘ │
└─────────────────────────────────────────────────┼───────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────┐
                 │                                                 │
                 ▼ (If file attached)                              ▼ (Metadata document)
┌─────────────────────────────────┐               ┌─────────────────────────────────┐
│ Firebase Storage                │               │ Firebase Firestore              │
│ Bucket: tfp-form.appspot.com    │               │ Collection: submissions         │
│ Path: submissions/{id}_{name}   │               │ Fields: name, contact, handle,  │
│ Max: 25 MB                      │               │ type, message, fileUrl, lang,   │
│ Rules: Write-only               │               │ createdAt (serverTimestamp)     │
└─────────────────────────────────┘               └─────────────────────────────────┘
```

### Data Schema (`submissions` Collection)
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Submitter full name (max 100 chars) |
| `contactType` | string | Preferred contact (`instagram`, `telegram`, `whatsapp`, `messenger`, `email`) |
| `handle` | string | Handle, phone number, or email address (max 120 chars) |
| `type` | string | Proposal type (`idea`, `script`, `festival`, `other`) |
| `message` | string | Concept synopsis or proposal pitch (max 4000 chars) |
| `fileUrl` | string / null | Firebase Storage download URL (if attached) |
| `fileName` | string / null | Original filename |
| `fileSizeBytes` | number / null | File size in bytes |
| `lang` | string | Page language (`lt` or `en`) |
| `createdAt` | timestamp | Server timestamp (`serverTimestamp()`) |

### Production Security Rules

#### Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submissionId} {
      // Anyone can submit proposals; no public reads, updates, or deletes
      allow create: if request.resource.data.keys().hasAll(['name', 'contactType', 'handle', 'type', 'message', 'createdAt', 'lang'])
                    && request.resource.data.name is string && request.resource.data.name.size() > 0 && request.resource.data.name.size() <= 100
                    && request.resource.data.contactType in ['instagram', 'telegram', 'whatsapp', 'messenger', 'email']
                    && request.resource.data.handle is string && request.resource.data.handle.size() > 0 && request.resource.data.handle.size() <= 120
                    && request.resource.data.type in ['idea', 'script', 'festival', 'other']
                    && request.resource.data.message is string && request.resource.data.message.size() <= 4000
                    && request.resource.data.lang in ['lt', 'en']
                    && request.resource.data.createdAt == request.time;
      allow read, update, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### Firebase Storage Security Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{allPaths=**} {
      // Allow upload of any proposal/script file up to 25MB; no public reads or deletes
      allow write: if request.resource.size <= 25 * 1024 * 1024;
      allow read, delete: if false;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. File Inventory & Cleanup Strategy

### Files to Delete (Obsolete Desktop OS Artifacts & Redundant Files)
- `en.html` (Replaced by clean `/en/index.html`)
- `portfolio-config.js` (Replaced by clean, consolidated `config.js`)
- Any temporary or unused files

### Final Streamlined File Architecture
- `/index.html` — Main website entry in Lithuanian (Hero, Films, About, Form, Contacts)
- `/en/index.html` — English edition of the website
- `/config.js` — Single source of truth: Firebase config, 11 YouTube films, contact placeholders, social links
- `/style.css` — Cinematic dark minimalist stylesheet (grotesque typography, responsive video container, form styling, scroll reveals)
- `/script.js` — Client logic (lazy-loading embeds, Firebase submission handler, 25MB validation, intersection observer)
- `/server.js` — Node.js static server serving root and `/en`
- `/metadata.json` — AI Studio applet metadata
- `/package.json` — Server dependencies

---

## 6. Verification Plan

1. **Visual & Layout Inspection**: Confirm pure cinematic aesthetic with `ERDVĖ. ŠVIESA. EMOCIJA.` motto, stacked films list, and grotesque typography.
2. **Lazy-Load YouTube Embeds**: Verify video iframes initialize smoothly upon viewport entry or user interaction without impacting initial load.
3. **Form & Firebase Validation**:
   - Test submission with all fields and an attached file ($\le 25\text{MB}$).
   - Test file size limit error when selecting a file $> 25\text{MB}$.
   - Verify success message state upon completion.
4. **Bilingual Navigation**: Verify toggle between `/index.html` (LT) and `/en/index.html` (EN).
5. **Security Rules & Console Guide**: Deliver clear instructions on pasting rules into the Firebase Console and inspecting the `submissions` collection.
6. **Compilation Check**: Run `compile_applet` to verify clean build and server functionality.
