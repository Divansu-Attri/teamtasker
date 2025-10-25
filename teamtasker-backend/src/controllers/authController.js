const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const activityService = require('../services/activityService');

const SALT_ROUNDS = 10;

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash },
      select: { id: true, name: true, email: true }
    });

    activityService.log('user_signup', { userId: user.id, name: user.name }, null, {});
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User exists or invalid data' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

    activityService.log('user_login', { userId: user.id, name: user.name }, null, {});
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get all users (for assigning tasks etc.)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};