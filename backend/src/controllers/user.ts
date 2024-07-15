import { Request, Response } from 'express';
import User from '../models/user';
import { logger } from '../utils/logger';

export const userController = {
    async searchUsers(req: Request, res: Response) {
        try {
            const { query } = req.query;
            const currentUserId = req.userId;

            logger.info(`Searching users with query: ${query}`);

            if (typeof query !== 'string') {
                logger.warn(`Invalid search query received: ${query}`);
                return res.status(400).json({ message: 'Invalid search query' });
            }
            const searchRegex = new RegExp(query, 'i');

            const users = await User.find({
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

            logger.info(`Found ${users.length} users matching query: ${query}`);
            res.json(users);
        } catch (error) {
            logger.error('Error searching users', error as Error);
            res.status(500).json({ message: 'Error searching users', error });
        }
    },
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.find().select('-password');
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    },

    async getUser(req: Request, res: Response) {
        const userId = req.params.id;
        logger.info(`Fetching user with ID: ${userId}`);
        try {
            const user = await User.findById(userId).select('-password');

            if (!user) {
                logger.warn(`User not found with ID: ${userId}`);
                return res.status(404).json({ message: 'User not found' });
            }

            logger.info(`Successfully retrieved user: ${userId}`);
            res.json(user);
        } catch (error) {
            logger.error(`Error fetching user ${userId}: ${error}`, error as Error);
            res.status(500).json({ message: 'Error fetching user', error });
        }
    },

    async deleteUser(req: Request, res: Response) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    },
};