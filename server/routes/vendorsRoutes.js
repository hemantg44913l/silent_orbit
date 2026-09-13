import { Router } from 'express';
import { vendorController } from '../controllers/vendorController.js';

const router = Router();

router.get('/', vendorController.getVendors);
router.post('/', vendorController.createVendor);
router.get('/:id', vendorController.getVendorById);

export default router;
