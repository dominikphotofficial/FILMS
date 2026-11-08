import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Body parsers with high limit for document & PDF uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File storage directory for persistent submissions
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure submissions file exists with valid JSON array
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helper to safely read submissions
function getSubmissions() {
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading submissions file:', e);
    return [];
  }
}

// Helper to safely write submissions
function saveSubmissions(list) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error saving submissions file:', e);
    return false;
  }
}

// ==========================================================================
// API Endpoints
// ==========================================================================

// 1. Submit Proposal (Fail-proof endpoint for client fallback)
app.post('/api/submit-proposal', (req, res) => {
  try {
    const body = req.body || {};
    const {
      name,
      country,
      role,
      type,
      contactType,
      handle,
      contact,
      message,
      status,
      unread,
      notes,
      lang,
      fileName,
      fileSizeBytes,
      fileMimeType,
      fileUrl,
      fileDataUrl,
      storageMethod,
      storagePath
    } = body;

    if (!name || !message || (!handle && !contact)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields (name, handle, message)'
      });
    }

    const submissions = getSubmissions();
    const newId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newSubmission = {
      id: newId,
      name: String(name).trim(),
      country: country || 'Global',
      role: role || 'Other',
      type: type || 'Join the Film Team',
      contactType: contactType || 'Email',
      handle: String(handle || contact).trim(),
      contact: contact || `${contactType}: ${handle}`,
      message: String(message).trim(),
      status: status || 'new',
      unread: unread !== false,
      notes: notes || '',
      lang: lang || 'en',
      fileName: fileName || null,
      fileSizeBytes: fileSizeBytes || null,
      fileMimeType: fileMimeType || null,
      fileUrl: fileUrl || null,
      fileDataUrl: fileDataUrl || null,
      storageMethod: storageMethod || (fileDataUrl ? 'server_base64' : 'server_meta'),
      storagePath: storagePath || null,
      createdAtIso: new Date().toISOString(),
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };

    submissions.unshift(newSubmission);
    saveSubmissions(submissions);

    console.log(`[API] New proposal received from ${name} (${contactType}: ${handle}) - ID: ${newId}`);

    return res.status(200).json({
      success: true,
      id: newId,
      message: 'Proposal successfully recorded'
    });
  } catch (err) {
    console.error('[API] Error in /api/submit-proposal:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error saving proposal'
    });
  }
});

// 2. Admin Login (Direct Passcode & Email Authentication)
app.post('/api/admin/login', (req, res) => {
  try {
    const { passcode, email, password } = req.body || {};

    const validPasscodes = [
      'dominik2026',
      'DominikAdmin2026!',
      'dp2026',
      'dominikphotofficial',
      process.env.ADMIN_PASSCODE
    ].filter(Boolean);

    let isAuthorized = false;

    // Check passcode
    if (passcode && validPasscodes.includes(String(passcode).trim())) {
      isAuthorized = true;
    }

    // Check email credentials
    if (email && String(email).trim().toLowerCase() === 'dominikphotofficial.lt@gmail.com') {
      if (password && (password === 'dominik2026' || validPasscodes.includes(password))) {
        isAuthorized = true;
      }
    }

    if (isAuthorized) {
      return res.status(200).json({
        success: true,
        email: 'dominikphotofficial.lt@gmail.com',
        token: `dp_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        message: 'Admin authorization successful'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Neteisingas administratoriaus slaptažodis arba el. paštas.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Login error' });
  }
});

// 3. Admin Get Submissions
app.get('/api/admin/submissions', (req, res) => {
  try {
    const submissions = getSubmissions();
    return res.status(200).json({
      success: true,
      submissions
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error loading submissions' });
  }
});

// 4. Admin Update Submission (Status / Read / Archive)
app.patch('/api/admin/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const submissions = getSubmissions();
    const idx = submissions.findIndex(s => s.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    submissions[idx] = { ...submissions[idx], ...updates, updatedAtIso: new Date().toISOString() };
    saveSubmissions(submissions);

    return res.status(200).json({ success: true, submission: submissions[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error updating submission' });
  }
});

// 5. Admin Delete Submission
app.delete('/api/admin/submissions/:id', (req, res) => {
  try {
    const { id } = req.params;
    let submissions = getSubmissions();
    const beforeCount = submissions.length;
    submissions = submissions.filter(s => s.id !== id);

    if (submissions.length === beforeCount) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    saveSubmissions(submissions);
    return res.status(200).json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Error deleting submission' });
  }
});

// ==========================================================================
// Static Assets & Web Routes
// ==========================================================================

// Serve static assets from root
app.use(express.static(__dirname));

// Explicit English version: /en, /en/, /en/index.html
app.get(['/en', '/en/', '/en/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

// Explicit Lithuanian version: /lt, /lt/, /lt/index.html
app.get(['/lt', '/lt/', '/lt/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'lt', 'index.html'));
});

// Admin panel (stealth URL - accessed directly via address bar)
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Root /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/lt')) {
    res.sendFile(path.join(__dirname, 'lt', 'index.html'));
  } else if (req.path.startsWith('/en')) {
    res.sendFile(path.join(__dirname, 'en', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
