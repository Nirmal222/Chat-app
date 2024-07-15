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
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const user_1 = __importDefault(require("../models/user"));
const message_1 = __importDefault(require("../models/message"));
const logger_1 = require("../utils/logger");
const mongoose_1 = require("mongoose");
// export const setupSocketIO = (server: HTTPServer) => {
//   const io = new SocketIOServer(server, {
//     cors: {
//       origin: process.env.CLIENT_URL || 'http://localhost:3000',
//       methods: ['GET', 'POST'],
//     },
//   });
//   const connectedUsers = new Map<string, string>();
//   io.on('connection', (socket) => {
//     socket.on('user_connected', async (userId: string) => {
//       logger.info('User connected');
//       console.log(userId);
//       connectedUsers.set(socket.id, userId);
//       await User.findByIdAndUpdate(userId, { isActive: true, lastSeen: new Date() });
//       socket.broadcast.emit('user_status_changed', { userId, isActive: true });
//     });
//     socket.on('send_message', async (data: { sender: string; recipient: string; content: string }) => {
//       console.log("Received a message", data);
//       try {
//         const { sender, recipient, content } = data;
//         const message = new Message({
//           sender: new Types.ObjectId(sender),
//           recipient: new Types.ObjectId(recipient),
//           content
//         });
//         await message.save();
//         const recipientSocketId = Array.from(connectedUsers.entries())
//           .find(([, id]) => id === recipient)?.[0];
//         if (recipientSocketId) {
//           io.to(recipientSocketId).emit('new_message', message);
//         }
//         socket.emit('new_message', message);
//         console.log("Message sent to both parties", message);
//       } catch (error) {
//         console.error('Error saving message:', error);
//         socket.emit('message_error', { error: 'Failed to send message' });
//       }
//     });
//     socket.on('typing', (data: { senderId: string; recipientId: string }) => {
//       const recipientSocketId = Array.from(connectedUsers.entries())
//         .find(([, id]) => id === data.recipientId)?.[0];
//       if (recipientSocketId) {
//         io.to(recipientSocketId).emit('typing', { senderId: data.senderId });
//       }
//     });
//     socket.on('stop_typing', (data: { senderId: string; recipientId: string }) => {
//       const recipientSocketId = Array.from(connectedUsers.entries())
//         .find(([, id]) => id === data.recipientId)?.[0];
//       if (recipientSocketId) {
//         io.to(recipientSocketId).emit('stop_typing', { senderId: data.senderId });
//       }
//     });
//     socket.on('disconnect', async () => {
//       const userId = connectedUsers.get(socket.id);
//       if (userId) {
//         await User.findByIdAndUpdate(userId, { isActive: false, lastSeen: new Date() });
//         socket.broadcast.emit('user_status_changed', { userId, isActive: false });
//         connectedUsers.delete(socket.id);
//       }
//       console.log('Client disconnected');
//     });
//   });
//   return io;
// };
const setupSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });
    const connectedUsers = new Map();
    io.on('connection', (socket) => {
        socket.on('user_connected', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.logger.info('User connected');
            console.log(userId);
            connectedUsers.set(socket.id, userId);
            yield user_1.default.findByIdAndUpdate(userId, { isActive: true, lastSeen: new Date() });
            socket.broadcast.emit('user_status_changed', { userId, isActive: true });
        }));
        socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Received a message", connectedUsers);
            try {
                const { sender, recipient, content } = data;
                const message = new message_1.default({
                    sender: new mongoose_1.Types.ObjectId(sender),
                    recipient: new mongoose_1.Types.ObjectId(recipient),
                    content
                });
                yield message.save();
                const recipientSocketId = Array.from(connectedUsers.entries())
                    .find(([, id]) => {
                    console.log(id, recipient);
                    return id === recipient;
                });
                console.log(recipientSocketId, connectedUsers, "recipientSocketId");
                if (recipientSocketId) {
                    console.log(recipientSocketId, "recipientSocketId");
                    io.to(recipientSocketId).emit('new_message', message);
                }
                socket.emit('new_message', message);
                console.log("Message sent to both parties", message);
            }
            catch (error) {
                console.error('Error saving message:', error);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        }));
        socket.on('typing', (data) => {
            var _a;
            const recipientSocketId = (_a = Array.from(connectedUsers.entries())
                .find(([, id]) => id === data.recipientId)) === null || _a === void 0 ? void 0 : _a[0];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing', { senderId: data.senderId });
            }
        });
        socket.on('stop_typing', (data) => {
            var _a;
            const recipientSocketId = (_a = Array.from(connectedUsers.entries())
                .find(([, id]) => id === data.recipientId)) === null || _a === void 0 ? void 0 : _a[0];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('stop_typing', { senderId: data.senderId });
            }
        });
        socket.on('disconnect', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = connectedUsers.get(socket.id);
            if (userId) {
                yield user_1.default.findByIdAndUpdate(userId, { isActive: false, lastSeen: new Date() });
                socket.broadcast.emit('user_status_changed', { userId, isActive: false });
                connectedUsers.delete(socket.id);
            }
            console.log('Client disconnected');
        }));
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
//# sourceMappingURL=socketHandler.js.map