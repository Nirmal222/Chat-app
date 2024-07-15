import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { userId: string };
        socket.data.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
};