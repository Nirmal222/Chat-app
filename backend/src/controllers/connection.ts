import { Request, Response } from 'express';
import Connection from '../models/connection';
import { asyncHandler } from '../utils/asyncHandler';
import User from '../models/user';

export const sendConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    const { requesterId, recipientId } = req.body;

    if (requesterId === recipientId) {
        return res.status(400).json({ message: 'Cannot create a connection with yourself' });
    }

    try {
        // Check if a connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            switch (existingConnection.status) {
                case 'pending':
                    return res.status(409).json({ message: 'Connection request already pending' });
                case 'accepted':
                    return res.status(409).json({ message: 'Connection already exists' });
                case 'rejected':
                    return res.status(409).json({ message: 'Connection request was previously rejected' });
                default:
                    return res.status(409).json({ message: 'Connection already exists in an unknown state' });
            }
        }

        // If no existing connection, create a new one
        const connection = new Connection({ requester: requesterId, recipient: recipientId });
        await connection.save();
        res.status(201).json({ message: 'Connection request sent' });

    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const respondToConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
    const { connectionId, status } = req.body;
    await Connection.findByIdAndUpdate(connectionId, { status });
    res.json({ message: 'Connection request updated' });
});

export const getUserConnections = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const connections = await Connection.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: 'accepted'
    }).populate('requester recipient', 'username');
    res.json(connections);
});

export const getUserConnection = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { userId, otherUserId } = req.params;
        const connection = await Connection.findOne({
            $or: [
                { requester: userId, recipient: otherUserId },
                { requester: otherUserId, recipient: userId }
            ]
        });

        let status = 'not_connected';
        if (connection) {
            status = connection.status;
        }

        res.json(status);
    } catch (error) {
        console.error('Error getting user connection:', error);
        res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
});

export const getRequests = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { recepient, status } = req.body;
        const connections = await Connection.find({ recipient: recepient, status: status });
        const connectionsWithNames = await Promise.all(connections.map(async (conn) => {
            const requester = await User.findById(conn.requester).select('-password -__v');
            return {
                ...conn.toObject(),
                username: requester ? requester.username : null,
            };
        }));

        res.json(connectionsWithNames);
    } catch (error) {
        console.error('Error fetching pending connections:', error);
        res.status(500).json({ message: 'Error fetching pending connections', error: error });
    }
});