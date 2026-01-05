const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');
const subController = require('../controllers/subscriptionController');
const communityController = require('../controllers/communityController');

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

// --- Subscription Management ---
router.get('/subs/requests', protect, subController.getPendingRequests);
router.post('/subs/approve', protect, subController.approveRequest);
router.post('/subs/reject', protect, subController.rejectRequest);

// NEW: Force Update (God Mode)
router.post('/subs/update-level', protect, subController.updateUserLevel);

router.get('/community/posts', protect, communityController.getCommunityFeed);
router.delete('/community/posts/:id', protect, communityController.deletePost);
router.delete('/community/comments/:id', protect, communityController.deleteComment);

router.get('/community/reports', protect, communityController.getReports);
router.delete('/community/reports/:id', protect, communityController.deleteReport);

module.exports = router;