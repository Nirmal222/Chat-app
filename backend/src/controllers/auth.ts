import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  logger.info('--> signup')
  try {
    logger.info('Received signup request');
    const { username, email, password } = JSON.parse(req.body.data);

    logger.info(`Checking if user exists: ${email}`);
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn(`Signup attempt with existing user: ${email}`);
      res.status(400);
      throw new Error('User already exists');
    }

    logger.info('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    logger.info(`Creating new user: ${email}`);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    logger.info(`User created successfully: ${email}`);
    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500);
    if (error instanceof Error) {
      logger.error('Failed to create user', error);
      throw new Error(`Failed to create user: ${error.message}`);
    } else {
      logger.error('An unexpected error occurred during user creation', new Error('Unknown error'));
      throw new Error('An unexpected error occurred');
    }
  } finally {
    logger.info('<-- signup')
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  logger.info('--> login')
  try {
    const { email, password } = req.body.data;
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Authentication failed: No user found for email ${email}`);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Authentication failed: Invalid password for email ${email}`);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    logger.info(`User logged in successfully: ${email}`);
    res.json({ token, userId: user._id, username: user.username });
  } catch (error) {
    logger.error('Login error occurred', error as Error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    logger.info('<-- login')
  }
});