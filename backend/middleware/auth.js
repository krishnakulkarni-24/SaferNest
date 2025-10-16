const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

exports.volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') return next();
  return res.status(403).json({ message: 'Volunteer access required' });
};

exports.residentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'resident') return next();
  return res.status(403).json({ message: 'Resident access required' });
};