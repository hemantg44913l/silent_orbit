import { Router } from 'express';
import { materialController } from '../controllers/materialController.js';

const router = Router();

router.get('/', materialController.getMaterials);
router.post('/', materialController.createMaterial);
router.get('/:id', materialController.getMaterialById);

export default router;
