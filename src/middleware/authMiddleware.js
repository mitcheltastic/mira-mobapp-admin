const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Remove "Bearer " string)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user to request
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, invalid token' 
      });
    }
  }

  // 2. If no token found
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }
};