require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Only listen to the port if running locally (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel to handle as a Serverless Function
module.exports = app;