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

// Direct route for English version
app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'en.html'));
});

// Fallback to index.html for root or other routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/en')) {
    res.sendFile(path.join(__dirname, 'en.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
