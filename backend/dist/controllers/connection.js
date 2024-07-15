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
exports.getRequests = exports.getUserConnection = exports.getUserConnections = exports.respondToConnectionRequest = exports.sendConnectionRequest = void 0;
const connection_1 = __importDefault(require("../models/connection"));
const asyncHandler_1 = require("../utils/asyncHandler");
const user_1 = __importDefault(require("../models/user"));
exports.sendConnectionRequest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requesterId, recipientId } = req.body;
    if (requesterId === recipientId) {
        return res.status(400).json({ message: 'Cannot create a connection with yourself' });
    }
    try {
        // Check if a connection already exists
        const existingConnection = yield connection_1.default.findOne({
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
        const connection = new connection_1.default({ requester: requesterId, recipient: recipientId });
        yield connection.save();
        res.status(201).json({ message: 'Connection request sent' });
    }
    catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.respondToConnectionRequest = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { connectionId, status } = req.body;
    yield connection_1.default.findByIdAndUpdate(connectionId, { status });
    res.json({ message: 'Connection request updated' });
}));
exports.getUserConnections = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const connections = yield connection_1.default.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: 'accepted'
    }).populate('requester recipient', 'username');
    res.json(connections);
}));
exports.getUserConnection = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, otherUserId } = req.params;
        const connection = yield connection_1.default.findOne({
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
    }
    catch (error) {
        console.error('Error getting user connection:', error);
        res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
}));
exports.getRequests = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recepient, status } = req.body;
        const connections = yield connection_1.default.find({ recipient: recepient, status: status });
        const connectionsWithNames = yield Promise.all(connections.map((conn) => __awaiter(void 0, void 0, void 0, function* () {
            const requester = yield user_1.default.findById(conn.requester).select('-password -__v');
            return Object.assign(Object.assign({}, conn.toObject()), { username: requester ? requester.username : null });
        })));
        res.json(connectionsWithNames);
    }
    catch (error) {
        console.error('Error fetching pending connections:', error);
        res.status(500).json({ message: 'Error fetching pending connections', error: error });
    }
}));
//# sourceMappingURL=connection.js.map