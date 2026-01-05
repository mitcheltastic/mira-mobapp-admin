const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();

// --- 1. IMPORT CONTROLLERS ---
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');
const subController = require('../controllers/subscriptionController');
const communityController = require('../controllers/communityController');
const excelController = require('../controllers/excelController');

// --- 2. IMPORT MIDDLEWARE (ONCE ONLY) ---
const { protect } = require('../middleware/authMiddleware');

// --- 3. CONFIGURE MULTER ---
const upload = multer({ storage: multer.memoryStorage() });

// ================= ROUTES =================

// --- Admin Auth ---
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.get('/whoami', protect, adminController.getMe);
router.post('/logout', protect, adminController.logoutAdmin);
router.delete('/:id', protect, adminController.deleteAdmin);

// --- User Management ---
router.get('/users', protect, usersController.getUsersList);     
router.delete('/users/:id', protect, usersController.deleteUser); 

// --- Subscription Management ---
router.get('/subs/requests', protect, subController.getPendingRequests);
router.post('/subs/approve', protect, subController.approveRequest);
router.post('/subs/reject', protect, subController.rejectRequest);
router.post('/subs/update-level', protect, subController.updateUserLevel); // God Mode

// --- Community Management ---
router.get('/community/posts', protect, communityController.getCommunityFeed);
router.delete('/community/posts/:id', protect, communityController.deletePost);
router.delete('/community/comments/:id', protect, communityController.deleteComment);

// --- Moderation (Reports) ---
router.get('/community/reports', protect, communityController.getReports);
router.delete('/community/reports/:id', protect, communityController.deleteReport);

// --- Excel Operations ---
router.get('/export/profiles', protect, excelController.exportProfiles); // Download
router.post('/import/posts', protect, upload.single('file'), excelController.importPosts); // Upload

module.exports = router;