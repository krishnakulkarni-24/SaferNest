const express = require('express');
const router = express.Router();
const { createHelpRequest, listHelpRequests, acceptHelpRequest, updateHelpRequestStatus } = require('../controllers/helpRequestController');
const { protect, residentOnly, volunteerOnly, adminOnly } = require('../middleware/auth');

// Resident creates help request
router.post('/', protect, residentOnly, createHelpRequest);

// Listing: residents see their own; volunteers/admin see all or filtered
router.get('/', protect, listHelpRequests);

// Volunteer accepts a help request
router.post('/:id/accept', protect, volunteerOnly, acceptHelpRequest);

// Update status: volunteer (own accepted) or admin
router.put('/:id/status', protect, updateHelpRequestStatus);

module.exports = router;


