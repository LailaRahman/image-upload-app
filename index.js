import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

let uploadedImage = null;

// Routes
app.get('/', (req, res) => {
  res.render('index', { image: uploadedImage, success: req.query.success });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('image'), (req, res) => {
  uploadedImage = `/uploads/${req.file.filename}`;
  res.redirect('/?success=true');
});

app.post('/delete', (req, res) => {
  if (uploadedImage) {
    const filePath = path.join(__dirname, 'public', uploadedImage);
    fs.unlink(filePath, err => {
      if (err) console.error(err);
      uploadedImage = null;
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

