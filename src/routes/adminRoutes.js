const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Protected routes (Require Token)
router.get('/whoami', protect, adminController.getMe);
router.delete('/:id', protect, adminController.deleteAdmin); // Usually delete should be protected too
router.post('/logout', protect, adminController.logoutAdmin);

module.exports = router;