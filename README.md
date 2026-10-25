# DP | FILMS — Portfolio Website & Submission Engine

Official website for **DP | FILMS** (Dominik Šuškevič — Videographer, Photographer & Filmmaker).

- **Lithuanian version**: `/index.html` (default route `/`)
- **English version**: `/en/index.html` (route `/en`)
- **Config & data**: `/config.js` (Films list, social handles, Firebase credentials)

---

## Firebase Configuration & Security Rules

Submissions and scripts are stored in the Firebase project (`tfp-form`):
- Text fields & metadata: **Firestore Database** (`submissions` collection)
- Uploaded files: **Firebase Storage** (`submissions/` directory) with resilient Base64 fallback in Firestore for documents (CVs, scripts, text files) under 750 KB.

### 1. Firebase Storage Security Rules
In the [Firebase Console](https://console.firebase.google.com/) → **Storage** → **Rules**, paste the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Submissions folder: allow public/anonymous uploads up to 25 MB
    match /submissions/{allPaths=**} {
      allow write: if request.resource.size <= 25 * 1024 * 1024;
      allow read, delete: if false; // Only accessible by admin in the Firebase Console
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

> **Note**: If you have Anonymous Authentication enabled in **Firebase Console → Authentication → Sign-in method → Anonymous**, you can also use `allow write: if request.auth != null && request.resource.size <= 25 * 1024 * 1024;`. Both modes are supported automatically by `script.js`.

---

### 2. Cloud Firestore Security Rules
In the [Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → **Rules**, paste the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Submissions collection: public users can create new entries, but cannot read, list, update, or delete
    match /submissions/{submissionId} {
      allow create: if request.resource.data.name is string
                    && request.resource.data.contactType is string
                    && request.resource.data.handle is string
                    && request.resource.data.type is string
                    && request.resource.data.message is string;
      allow read, update, delete: if false;
    }

    // Default lock down
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Where to View Submissions

1. Open the [Firebase Console](https://console.firebase.google.com/) and select the **tfp-form** project.
2. Go to **Firestore Database** in the left menu.
3. Open the **`submissions`** collection. Each submitted proposal contains:
   - `name`: Sender's name
   - `contactType`: Chosen communication channel (Instagram, Telegram, WhatsApp, Messenger, or Email)
   - `handle`: Username or contact address
   - `type`: Submission category (`idea`, `script`, `festival`, `other`)
   - `message`: Proposal text or script outline
   - `lang`: Language used (`lt` or `en`)
   - `createdAt`: Timestamp
   - `storageMethod`: `firebase_storage` (with direct download link in `fileUrl`) or `firestore_direct_base64` (embedded file data in `fileDataUrl` for documents such as CVs and scripts).
4. For files stored in Firebase Storage, open **Storage** → **Files** → `submissions/` to inspect or download.

---

## Development & Deployment

- **Dev / Production Server**:
  ```bash
  npm start
  # or
  node server.js
  ```
  Listens on port `3000` (serves `/` and `/en`).
