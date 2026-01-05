const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController'); // <--- NEW IMPORT

// Import Middleware
const { protect } = require('../middleware/authMiddleware');

// --- Admin Auth Routes ---
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/whoami', protect, adminController.getMe);
router.post('/logout', protect, adminController.logoutAdmin);
router.delete('/:id', protect, adminController.deleteAdmin);

// --- User Management Routes (New Controller) ---
// Prefix is still /api/admin/users
router.get('/users', protect, usersController.getUsersList);     
router.delete('/users/:id', protect, usersController.deleteUser); 

module.exports = router;