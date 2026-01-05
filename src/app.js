const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 1. FIX: Destructure 'protect' from the import
const { protect } = require('./middleware/authMiddleware'); 

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// 3. Apply protection INSIDE the specific route files or specifically here
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Mira Admin API is running 🚀');
});

module.exports = app;