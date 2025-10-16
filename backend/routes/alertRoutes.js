const express = require('express');
const router = express.Router();
const { createAlert, getAlerts, deactivateAlert, updateAlert, acceptTask } = require('../controllers/alertController');
const { protect, adminOnly, volunteerOnly } = require('../middleware/auth');

router.get('/', getAlerts);               // public read
router.post('/', protect, adminOnly, createAlert);     // only admin create
router.put('/:id/deactivate', protect, adminOnly, deactivateAlert);
router.put('/:id', protect, adminOnly, updateAlert);   // admin edits alert
router.post('/:id/accept', protect, volunteerOnly, acceptTask); // volunteer accepts task

module.exports = router;
