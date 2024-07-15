import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.warn('Authentication failed: No token provided');
      res.status(401).json({ message: 'Authentication failed' });
      return;
    }
    logger.info('Verifying JWT token');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: string };
    req['userId'] = decodedToken.userId;
    logger.info(`User authenticated: ${req.userId}`)
    next();
  } catch (error) {
    logger.error('Authentication failed', error as Error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};