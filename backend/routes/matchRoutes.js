import { Router } from 'express';
import { matchingController } from '../controllers/matchingController.js';

const router = Router();

router.post('/', matchingController.matchTextile);

export default router;
