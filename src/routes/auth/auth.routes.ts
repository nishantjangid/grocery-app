import { Router } from 'express';
import { authController } from '../../controllers';
import userValidators from '../../middlewares/validators/users/validation';
const router = Router();

router.post(
  '/signup',
  userValidators.createUserSchema,
  [userValidators.validate],
  authController.signup,
);

router.post(
  '/login',
  userValidators.loginUserSchema,
  [userValidators.validate],
  authController.login,
);

export default router;
