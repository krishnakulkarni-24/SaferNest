import express from 'express';
const router = express.Router();
import { 
  submitContact, 
  getContactSubmissions, 
  updateContactStatus, 
  deleteContactSubmission 
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

// Public route - anyone can submit contact form
router.post('/submit', submitContact);

// Admin only routes
router.get('/submissions', protect, adminOnly, getContactSubmissions);
router.put('/submissions/:id', protect, adminOnly, updateContactStatus);
router.delete('/submissions/:id', protect, adminOnly, deleteContactSubmission);

export default router;
