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
exports.userController = void 0;
const user_1 = __importDefault(require("../models/user"));
const logger_1 = require("../utils/logger");
exports.userController = {
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                const currentUserId = req.userId;
                logger_1.logger.info(`Searching users with query: ${query}`);
                if (typeof query !== 'string') {
                    logger_1.logger.warn(`Invalid search query received: ${query}`);
                    return res.status(400).json({ message: 'Invalid search query' });
                }
                const searchRegex = new RegExp(query, 'i');
                const users = yield user_1.default.find({
                    $and: [
                        { _id: { $ne: currentUserId } },
                        {
                            $or: [
                                { username: searchRegex },
                                { email: searchRegex }
                            ]
                        }
                    ]
                }).select('-password');
                logger_1.logger.info(`Found ${users.length} users matching query: ${query}`);
                res.json(users);
            }
            catch (error) {
                logger_1.logger.error('Error searching users', error);
                res.status(500).json({ message: 'Error searching users', error });
            }
        });
    },
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_1.default.find().select('-password');
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching users', error });
            }
        });
    },
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            logger_1.logger.info(`Fetching user with ID: ${userId}`);
            try {
                const user = yield user_1.default.findById(userId).select('-password');
                if (!user) {
                    logger_1.logger.warn(`User not found with ID: ${userId}`);
                    return res.status(404).json({ message: 'User not found' });
                }
                logger_1.logger.info(`Successfully retrieved user: ${userId}`);
                res.json(user);
            }
            catch (error) {
                logger_1.logger.error(`Error fetching user ${userId}: ${error}`, error);
                res.status(500).json({ message: 'Error fetching user', error });
            }
        });
    },
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findByIdAndDelete(req.params.id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json({ message: 'User deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting user', error });
            }
        });
    },
};
//# sourceMappingURL=user.js.map