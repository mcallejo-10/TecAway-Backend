import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = Router();

router.post('/send-message', sendContactMessage);

export default router;