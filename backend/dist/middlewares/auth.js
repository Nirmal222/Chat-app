"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            logger_1.logger.warn('Authentication failed: No token provided');
            res.status(401).json({ message: 'Authentication failed' });
            return;
        }
        logger_1.logger.info('Verifying JWT token');
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req['userId'] = decodedToken.userId;
        logger_1.logger.info(`User authenticated: ${req.userId}`);
        next();
    }
    catch (error) {
        logger_1.logger.error('Authentication failed', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map