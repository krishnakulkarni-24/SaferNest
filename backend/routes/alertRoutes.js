import express from 'express';
const router = express.Router();
import { createAlert, getAlerts, deactivateAlert, updateAlert, acceptTask } from '../controllers/alertController.js';
import { protect, adminOnly, volunteerOnly } from '../middleware/auth.js';

router.get('/', getAlerts);               // public read
router.post('/', protect, adminOnly, createAlert);     // only admin create
router.put('/:id/deactivate', protect, adminOnly, deactivateAlert);
router.put('/:id', protect, adminOnly, updateAlert);   // admin edits alert
router.post('/:id/accept', protect, volunteerOnly, acceptTask); // volunteer accepts task

export default router;
