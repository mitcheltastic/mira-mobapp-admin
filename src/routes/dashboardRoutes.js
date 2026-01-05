const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route: /api/dashboard/features
router.get('/features', dashboardController.getFeatureUsage);

// Route: /api/dashboard/users
router.get('/user-count', dashboardController.getUserStats);

module.exports = router;