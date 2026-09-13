import { Router } from 'express';
import { disposalController } from '../controllers/disposalController.js';

const router = Router();

router.get('/', disposalController.getDisposalOptions);
router.get('/:id', disposalController.getDisposalOptionById);

export default router;
