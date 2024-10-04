// src/utils/jwt.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

/**
 * Generates a JWT token with the given payload.
 * @param {Object} payload - The payload to encode in the JWT.
 * @returns {String} - The signed JWT token.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies the given JWT token.
 * @param {String} token - The JWT token to verify.
 * @returns {Object} - The decoded payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
