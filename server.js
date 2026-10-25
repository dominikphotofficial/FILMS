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

// Route for English version
app.get(['/en', '/en/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

// Route for Lithuanian version (redirect to root /)
app.get(['/lt', '/lt/'], (req, res) => {
  res.redirect(301, '/');
});

// Fallback route handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/en')) {
    res.sendFile(path.join(__dirname, 'en', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
