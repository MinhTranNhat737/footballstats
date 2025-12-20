const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public routes (không cần auth)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (cần auth)
router.get('/me', requireAuth, authController.getCurrentUser);
router.post('/logout', requireAuth, authController.logout);

// Admin only routes
router.get('/users', requireAdmin, authController.getAllUsers);

module.exports = router;
