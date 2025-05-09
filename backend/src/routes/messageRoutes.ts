import express from 'express';
import { createPersonalizedMessage } from '../controllers/messageController';

const router = express.Router();

// POST generate personalized message
router.post('/', createPersonalizedMessage);

export default router;
