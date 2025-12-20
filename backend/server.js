require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const db = require('./db');
const playerRoutes = require('./routes/playerRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Enable CORS for Next.js frontend
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
    credentials: true
}));

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Tăng lên 10MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)'));
    }
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Route upload ảnh - ADMIN only
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file nào được upload' });
    }
    console.log('✅ Upload thành công:', req.file.filename);
    res.json({ 
        success: true, 
        message: 'Upload thành công',
        filename: req.file.filename,
        path: '/uploads/' + req.file.filename
    });
});

// Error handler cho multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'Ảnh quá lớn! Tối đa 10MB' 
            });
        }
        return res.status(400).json({ 
            success: false, 
            message: 'Lỗi upload: ' + err.message 
        });
    }
    if (err) {
        console.error('Error:', err);
        return res.status(500).json({ 
            success: false, 
            message: err.message || 'Lỗi server' 
        });
    }
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server đang chạy!' });
});

app.get('/api/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Database kết nối thành công!', result: results[0].solution });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/players`);
});
