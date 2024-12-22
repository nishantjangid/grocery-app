import { Router } from 'express';
import { ordersController } from '../../controllers';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/',authenticate,ordersController.createOrder);
router.get('/',authenticate,ordersController.getOrders);
router.get('/:id',authenticate,ordersController.getOrderById)

export default router;