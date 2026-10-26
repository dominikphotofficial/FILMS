import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Serve static assets from root
app.use(express.static(__dirname));

// Route for Lithuanian version: /lt and /lt/
app.get(['/lt', '/lt/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'lt', 'index.html'));
});

// Legacy /en routes redirect to root / (English is at root)
app.get(['/en', '/en/', '/en/*'], (req, res) => {
  res.redirect(301, '/');
});

// Admin panel (stealth URL - accessed directly via address bar)
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback route handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/lt')) {
    res.sendFile(path.join(__dirname, 'lt', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
