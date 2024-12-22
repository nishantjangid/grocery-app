import prisma from '../config/db.config';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ENV_VARIABLES from '../config/env.config';

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ error: 'Name, email, password, and role are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role:role == 1 ? "ADMIN" : "USER" },
    });

    const { password: _, ...userWithoutPassword } = user;

    // Return success message with the created user
    return res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    // Handle internal server error
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login function
const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Check if user exists and if the password is correct
    if (!user || !(await bcrypt.compare(password.toString(), user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV_VARIABLES.JWT_SECRET,
      { expiresIn: '30d' },
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { signup, login };
