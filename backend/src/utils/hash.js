// backend/src/utils/hash.js

const bcrypt = require("bcrypt");

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

/**
 * @desc    Hash a plaintext password
 * @param   {string} password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

/**
 * @desc    Compare a plaintext password with a hashed password
 * @param   {string} password
 * @param   {string} hashedPassword
 * @returns {boolean} True if match, else false
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
