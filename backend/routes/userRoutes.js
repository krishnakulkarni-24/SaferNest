import express from 'express';
const router = express.Router();
import { register, login, getMe, updateMe } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
