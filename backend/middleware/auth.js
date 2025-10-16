import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
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

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

export const volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') return next();
  return res.status(403).json({ message: 'Volunteer access required' });
};

export const residentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'resident') return next();
  return res.status(403).json({ message: 'Resident access required' });
};
