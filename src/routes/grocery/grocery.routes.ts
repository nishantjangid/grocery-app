import { Router } from 'express';
import { groceriesController } from '../../controllers';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Create a new grocery item (only accessible by admin)
router.post(
  '/',
  authenticate, // Authenticate the user
  authorize(['ADMIN']), // Authorize admin
  groceriesController.create,
);

// Get all groceries (accessible by everyone)
router.get('/', groceriesController.getAll);

// Get a single grocery item by ID (accessible by everyone)
router.get('/:id', groceriesController.getOne);

// Update a grocery item (only accessible by admin)
router.put(
  '/:id',
  authenticate, // Authenticate the user
  authorize(['ADMIN']), // Authorize admin
  groceriesController.update,
);

// Delete a grocery item (only accessible by admin)
router.delete(
  '/:id',
  authenticate, // Authenticate the user
  authorize(['ADMIN']), // Authorize admin
  groceriesController.delete,
);

export default router;
