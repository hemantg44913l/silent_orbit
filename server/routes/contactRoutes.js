import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';

const router = Router();

router.post('/contact', contactController.submitContact);
router.post('/feedback', contactController.submitFeedback);

export default router;
