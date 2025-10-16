const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getContactSubmissions, 
  updateContactStatus, 
  deleteContactSubmission 
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route - anyone can submit contact form
router.post('/submit', submitContact);

// Admin only routes
router.get('/submissions', protect, adminOnly, getContactSubmissions);
router.put('/submissions/:id', protect, adminOnly, updateContactStatus);
router.delete('/submissions/:id', protect, adminOnly, deleteContactSubmission);

module.exports = router;
