// src/controllers/authController.js

const { generateToken } = require('../utils/jwt');
const prisma = require("../../prismaClient");
const bcrypt = require('bcrypt');

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email)
  console.log("password ", password)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { login };
