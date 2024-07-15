"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        socket.data.userId = decoded.userId;
        next();
    }
    catch (error) {
        next(new Error('Authentication error'));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
//# sourceMappingURL=socketMiddleware.js.map