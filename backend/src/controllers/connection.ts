import { Request, Response } from 'express';
import Connection from '../models/connection';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/user';
import { logger } from '../utils/logger';

export const sendConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    logger.info("--> sendConnectionRequest");
    const { requesterId, recipientId } = req.body;

    if (requesterId === recipientId) {
        logger.warn(`Attempt to create connection with self: ${requesterId}`);
        logger.info("<-- sendConnectionRequest");
        return res.status(400).json({ message: 'Cannot create a connection with yourself' });
    }

    try {
        // Check if a connection already exists
        logger.info(`Checking for existing connection between ${requesterId} and ${recipientId}`);
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            logger.info(`Existing connection found with status: ${existingConnection.status}`);
            switch (existingConnection.status) {
                case 'pending':
                    logger.info("<-- sendConnectionRequest");
                    return res.status(409).json({ message: 'Connection request already pending' });
                case 'accepted':
                    logger.info("<-- sendConnectionRequest");
                    return res.status(409).json({ message: 'Connection already exists' });
                case 'rejected':
                    logger.info("<-- sendConnectionRequest");
                    return res.status(409).json({ message: 'Connection request was previously rejected' });
                default:
                    logger.warn(`Unknown connection status: ${existingConnection.status}`);
                    logger.info("<-- sendConnectionRequest");
                    return res.status(409).json({ message: 'Connection already exists in an unknown state' });
            }
        }

        logger.info(`Creating new connection request from ${requesterId} to ${recipientId}`);
        const connection = new Connection({ requester: requesterId, recipient: recipientId });
        await connection.save();
        logger.info("Connection request successfully created");
        logger.info("<-- sendConnectionRequest");
        res.status(201).json({ message: 'Connection request sent' });

    } catch (error) {
        logger.error("Error sending connection request", error as Error);
        logger.info("<-- sendConnectionRequest");
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const respondToConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    logger.info("--> respondToConnectionRequest");
    const { connectionId, status } = req.body;

    try {
        logger.info(`Updating connection ${connectionId} with status: ${status}`);
        const updatedConnection = await Connection.findByIdAndUpdate(connectionId, { status }, { new: true });

        if (!updatedConnection) {
            logger.warn(`Connection not found: ${connectionId}`);
            logger.info("<-- respondToConnectionRequest");
            return res.status(404).json({ message: 'Connection request not found' });
        }

        logger.info(`Connection ${connectionId} successfully updated to status: ${status}`);
        logger.info("<-- respondToConnectionRequest");
        res.json({ message: 'Connection request updated' });
    } catch (error) {
        logger.error("Error responding to connection request", error as Error);
        logger.info("<-- respondToConnectionRequest");
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const getUserConnections = async (req: Request, res: Response) => {
    logger.info("--> getUserConnections")
    try {
        const userId = req.params.userId;

        logger.info(`Fetching connections for user: ${userId}`);

        const connections = await Connection.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: 'accepted'
        })
        const connectionsWithNames = await Promise.all(connections.map(async (conn) => {
            const requester = await User.findById(conn.requester).select('-password -__v');
            return {
                ...conn.toObject(),
                username: requester ? requester.username : null,
            };
        }));

        logger.info(`Successfully fetched ${connectionsWithNames.length} connections for user: ${userId}`);

        res.json(connectionsWithNames);
    } catch (error) {
        logger.error('Error in getUserConnections:', error);
        res.status(500).json({ message: 'An error occurred while fetching user connections' });
    } finally {
        logger.info("<-- getUserConnections")
    }
};

export const getUserConnection = asyncHandler(async (req: Request, res: Response) => {
    logger.info("--> getUserConnection");
    try {
        const { userId, otherUserId } = req.params;
        logger.info(`Checking connection between users ${userId} and ${otherUserId}`);

        const connection = await Connection.findOne({
            $or: [
                { requester: userId, recipient: otherUserId },
                { requester: otherUserId, recipient: userId }
            ]
        });

        let status = 'not_connected';
        if (connection) {
            status = connection.status;
            logger.info(`Connection found with status: ${status}`);
        } else {
            logger.info('No connection found between the users');
        }

        logger.info(`Returning connection status: ${status}`);
        logger.info("<-- getUserConnection");
        res.json(status);
    } catch (error) {
        logger.error("Error getting user connection", error as Error);
        logger.info("<-- getUserConnection");
        res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
});

export const getRequests = asyncHandler(async (req: Request, res: Response) => {
    logger.info("--> getRequests");
    try {
        const { recipient, status } = req.body;
        logger.info(`Fetching connections for recipient ${recipient} with status ${status}`);

        const connections = await Connection.find({ recipient, status });
        logger.info(`Found ${connections.length} connections`);

        logger.info("Fetching requester details for each connection");
        const connectionsWithNames = await Promise.all(connections.map(async (conn) => {
            const requester = await User.findById(conn.requester).select('-password -__v');
            if (requester) {
                logger.info(`Found requester ${requester.username} for connection ${conn._id}`);
            } else {
                logger.warn(`Requester not found for connection ${conn._id}`);
            }
            return {
                ...conn.toObject(),
                username: requester ? requester.username : null,
            };
        }));

        logger.info(`Returning ${connectionsWithNames.length} connections with requester names`);
        logger.info("<-- getRequests");
        res.json(connectionsWithNames);
    } catch (error) {
        logger.error("Error fetching connections", error as Error);
        logger.info("<-- getRequests");
        res.status(500).json({ message: 'Error fetching connections', error: error });
    }
});