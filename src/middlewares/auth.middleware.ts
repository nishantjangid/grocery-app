import ENV_VARIABLES from '../config/env.config';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import CustomRequest from '../typescript/interface';

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // Return early after sending a response
  }

  try {
    const user = jwt.verify(token, ENV_VARIABLES.JWT_SECRET);
    req.user = user; // Add user to the request object
    next(); // Call next middleware if authentication is successful
  } catch (err) {
    res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
  }
};

// Middleware function to check user authorized role-based access
export const authorize =
  (roles: string[]) => (req: CustomRequest, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return; // Return early after sending a response
    }
    next(); // Call next middleware if authorization is successful
  };

export default {
  authenticate,
  authorize
}
