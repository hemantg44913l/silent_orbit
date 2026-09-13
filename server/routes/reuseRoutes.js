import { Router } from 'express';
import { reuseController } from '../controllers/reuseController.js';

const router = Router();

router.get('/', reuseController.getReuseOptions);
router.get('/:id', reuseController.getReuseOptionById);

export default router;
