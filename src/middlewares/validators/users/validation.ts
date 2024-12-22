import { body, ValidationChain } from 'express-validator';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
// CREATE USER SCHEMA
const createUserSchema: ValidationChain[] = [
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('name').notEmpty().withMessage('Name is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role')
    .notEmpty()
    .custom(async (value: number) => {
      if (!value) return Promise.reject('Role is required');
      if (typeof value !== 'number')
        return Promise.reject('Role should be numeric valud');
      if (value !== 1 && value !== 2) {
        return Promise.reject('Role Only expect 1 or 2, 1 for admin 2 for normal user');
      }
    }),
];

// LOGIN SCHEMA
const loginUserSchema: ValidationChain[] = [
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

export default { createUserSchema, loginUserSchema, validate };
