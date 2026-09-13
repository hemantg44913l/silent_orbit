import { Router } from 'express';
import { textileController } from '../controllers/textileController.js';

const router = Router();

router.post('/', textileController.submitTextile);
router.get('/', textileController.getTextiles);
router.get('/:id', textileController.getTextileById);

export default router;
