import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment configuration securely from root .env
dotenv.config({ path: path.join(rootDir, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const OWNER_USERNAME = process.env.OWNER_USERNAME || 'kritika';
const OWNER_PASSWORD_HASH = process.env.OWNER_PASSWORD_HASH;

// Ensure directories exist
const uploadsDir = path.join(rootDir, 'public', 'uploads');
const serverDataDir = path.join(rootDir, 'server', 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(serverDataDir)) fs.mkdirSync(serverDataDir, { recursive: true });

const dataFilePath = path.join(serverDataDir, 'portfolioData.json');
const srcDataFilePath = path.join(rootDir, 'src', 'data', 'portfolioData.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Protected file serving for uploads with offer letter access controls
app.use('/uploads', (req, res, next) => {
  const isOfferLetter = req.path.includes('CT20265006112_OL') || req.path.toLowerCase().includes('ol__1_');
  if (isOfferLetter) {
    // Block cross-site hotlinking
    if (req.headers['sec-fetch-site'] === 'cross-site') {
      return res.status(403).json({ error: 'Direct cross-site access prohibited. Please view via the official portfolio.' });
    }
  }
  next();
}, express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    const isOfferLetter = filePath.includes('CT20265006112_OL') || filePath.toLowerCase().includes('ol__1_');
    if (filePath.toLowerCase().endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    if (isOfferLetter) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
  }
}));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) {
      if (file.mimetype === 'application/pdf') ext = '.pdf';
      else if (file.mimetype === 'image/png') ext = '.png';
      else if (file.mimetype === 'image/jpeg') ext = '.jpg';
      else ext = '.pdf';
    }
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const targetType = req.body.uploadType || 'doc';
    const finalName = `${targetType}_${Date.now()}_${cleanBase}${ext}`;
    cb(null, finalName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isPdf = ext === '.pdf' || file.mimetype === 'application/pdf' || file.originalname.toLowerCase().includes('pdf') || !ext;
    const isImage = ['.png', '.jpg', '.jpeg'].includes(ext) || file.mimetype.startsWith('image/');

    if (isPdf || isImage) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image formats (.png, .jpg) are permitted.'));
    }
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(503).json({ error: 'Authentication service not configured on server.' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied: Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
};

// --------------------------------------------------------------------------
// Authentication Endpoints
// --------------------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  if (!OWNER_PASSWORD_HASH || !JWT_SECRET) {
    console.error('[Auth Error] OWNER_PASSWORD_HASH or JWT_SECRET is not configured in server environment.');
    return res.status(503).json({ error: 'Owner authentication is not configured on the server. Please check environment configuration.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username.trim().toLowerCase() !== OWNER_USERNAME.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, OWNER_PASSWORD_HASH);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { username: OWNER_USERNAME, role: 'owner' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    user: { username: OWNER_USERNAME, role: 'owner' }
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --------------------------------------------------------------------------
// Portfolio Data Endpoints
// --------------------------------------------------------------------------
app.get('/api/portfolio', (req, res) => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      return res.json(JSON.parse(raw));
    }
    if (fs.existsSync(srcDataFilePath)) {
      const raw = fs.readFileSync(srcDataFilePath, 'utf-8');
      return res.json(JSON.parse(raw));
    }
    res.json({ status: 'default' });
  } catch (err) {
    console.error('Error reading portfolio data:', err);
    res.status(500).json({ error: 'Failed to read portfolio configuration.' });
  }
});

app.put('/api/portfolio', authenticateToken, (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== 'object') {
      return res.status(400).json({ error: 'Invalid portfolio data payload.' });
    }

    const jsonContent = JSON.stringify(updatedData, null, 2);
    // Write to server data directory
    fs.writeFileSync(dataFilePath, jsonContent, 'utf-8');
    // Sync to src/data directory for builds
    fs.writeFileSync(srcDataFilePath, jsonContent, 'utf-8');

    res.json({
      success: true,
      message: 'Portfolio data updated successfully on disk.',
      savedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error writing portfolio data:', err);
    res.status(500).json({ error: 'Failed to save portfolio configuration.' });
  }
});

// --------------------------------------------------------------------------
// Dedicated File Download Endpoint (Forces attachment with clean filename)
// --------------------------------------------------------------------------
app.get('/api/download', (req, res) => {
  const fileParam = req.query.file;
  let downloadName = req.query.name || 'document.pdf';
  if (!downloadName.toLowerCase().endsWith('.pdf') && !downloadName.match(/\.(png|jpe?g)$/i)) {
    downloadName += '.pdf';
  }
  if (!fileParam) {
    return res.status(400).send('Missing file parameter');
  }

  const safeFilename = path.basename(fileParam);
  const fullPath = path.join(uploadsDir, safeFilename);

  // Prohibit unrestricted direct file download for sensitive offer letter
  const isOfferLetter = safeFilename.includes('CT20265006112_OL') || safeFilename.toLowerCase().includes('ol__1_');
  if (isOfferLetter) {
    return res.status(403).send('Direct file download is prohibited for this document. Please use website preview.');
  }

  if (!fs.existsSync(fullPath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(fullPath);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  res.setHeader('Content-Length', stat.size);

  const stream = fs.createReadStream(fullPath);
  stream.pipe(res);
});

// --------------------------------------------------------------------------
// File Upload Endpoint (Protected)
// --------------------------------------------------------------------------
app.post('/api/upload', authenticateToken, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    const cleanOrigName = req.file.originalname.includes('.')
      ? req.file.originalname
      : `${req.file.originalname}${path.extname(req.file.filename)}`;

    return res.json({
      success: true,
      message: 'File uploaded and stored securely.',
      fileUrl: publicUrl,
      fileName: cleanOrigName,
      storedName: req.file.filename,
      size: req.file.size
    });
  });
});

// --------------------------------------------------------------------------
// Serve Static Frontend if built (in production)
// --------------------------------------------------------------------------
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Portfolio Server] Running on http://localhost:${PORT}`);
  console.log(`[Portfolio Server] Uploads directory: ${uploadsDir}`);
  if (!OWNER_PASSWORD_HASH || !JWT_SECRET) {
    console.warn('[Security Warning] OWNER_PASSWORD_HASH or JWT_SECRET is missing from server environment.');
  } else {
    console.log('[Security] Server-side bcrypt authentication & signed JWT sessions active.');
  }
});
