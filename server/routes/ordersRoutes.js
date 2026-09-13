import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateStatus);

export default router;
