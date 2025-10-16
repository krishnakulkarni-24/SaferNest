import express from 'express';
const router = express.Router();
import { createHelpRequest, listHelpRequests, acceptHelpRequest, updateHelpRequestStatus } from '../controllers/helpRequestController.js';
import { protect, residentOnly, volunteerOnly, adminOnly } from '../middleware/auth.js';

// Resident creates help request
router.post('/', protect, residentOnly, createHelpRequest);

// Listing: residents see their own; volunteers/admin see all or filtered
router.get('/', protect, listHelpRequests);

// Volunteer accepts a help request
router.post('/:id/accept', protect, volunteerOnly, acceptHelpRequest);

// Update status: volunteer (own accepted) or admin
router.put('/:id/status', protect, updateHelpRequestStatus);

export default router;
