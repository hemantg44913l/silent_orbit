import { Router } from 'express';
import { collectionPointController } from '../controllers/collectionPointController.js';

const router = Router();

router.get('/', collectionPointController.getCollectionPoints);
router.get('/:id', collectionPointController.getCollectionPointById);

export default router;
