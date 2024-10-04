// src/middlewares/authMiddleware.js

const { verifyToken } = require('../utils/jwt');

/**
 * Authentication Middleware
 * Verifies the JWT token and attaches the decoded user to the request object.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Auth Middleware Error: No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

/**
 * Authorization Middleware
 * Checks if the user has one of the required roles.
 */
const authorizeRoles = (...roles) => {
  console.log("Authorize Roles invoked")
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access is denied.' });
    }
    console.log("Role : ", req.user.role)
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
