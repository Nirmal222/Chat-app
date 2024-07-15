"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const asyncHandler_1 = require("../utils/asyncHandler");
const logger_1 = require("../utils/logger");
exports.signup = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('--> signup');
    try {
        logger_1.logger.info('Received signup request');
        const { username, email, password } = JSON.parse(req.body.data);
        logger_1.logger.info(`Checking if user exists: ${email}`);
        const existingUser = yield user_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            logger_1.logger.warn(`Signup attempt with existing user: ${email}`);
            res.status(400);
            throw new Error('User already exists');
        }
        logger_1.logger.info('Hashing password');
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        logger_1.logger.info(`Creating new user: ${email}`);
        const user = new user_1.default({ username, email, password: hashedPassword });
        yield user.save();
        logger_1.logger.info(`User created successfully: ${email}`);
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        res.status(500);
        if (error instanceof Error) {
            logger_1.logger.error('Failed to create user', error);
            throw new Error(`Failed to create user: ${error.message}`);
        }
        else {
            logger_1.logger.error('An unexpected error occurred during user creation', new Error('Unknown error'));
            throw new Error('An unexpected error occurred');
        }
    }
    finally {
        logger_1.logger.info('<-- signup');
    }
}));
exports.login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('--> login');
    try {
        const { email, password } = req.body.data;
        logger_1.logger.info(`Login attempt for email: ${email}`);
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            logger_1.logger.warn(`Authentication failed: No user found for email ${email}`);
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            logger_1.logger.warn(`Authentication failed: Invalid password for email ${email}`);
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        logger_1.logger.info(`User logged in successfully: ${email}`);
        res.json({ token, userId: user._id });
    }
    catch (error) {
        logger_1.logger.error('Login error occurred', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        logger_1.logger.info('<-- login');
    }
}));
//# sourceMappingURL=auth.js.map