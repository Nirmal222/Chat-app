import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import User from '../models/user';
import Message from '../models/message';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

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



export const setupSocketIO = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  const connectedUsers = new Map<string, string>();

  io.on('connection', (socket) => {

    socket.on('user_connected', async (userId: string) => {
      logger.info('User connected');
      console.log(userId);
      connectedUsers.set(socket.id, userId);
      await User.findByIdAndUpdate(userId, { isActive: true, lastSeen: new Date() });
      socket.broadcast.emit('user_status_changed', { userId, isActive: true });
    });

    socket.on('send_message', async (data: { sender: string; recipient: string; content: string }) => {
      console.log("Received a message", connectedUsers);
      try {
        const { sender, recipient, content } = data;
        const message = new Message({
          sender: new Types.ObjectId(sender),
          recipient: new Types.ObjectId(recipient),
          content
        });
        await message.save();

        const recipientSocketId = Array.from(connectedUsers.entries())
          .find(([, id]) => {
            console.log(id, recipient)
            return id === recipient
          })
        console.log(recipientSocketId, connectedUsers,"recipientSocketId")
        if (recipientSocketId) {
          console.log(recipientSocketId, "recipientSocketId")
          io.to(recipientSocketId).emit('new_message', message);
        }

        socket.emit('new_message', message);

        console.log("Message sent to both parties", message);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    socket.on('typing', (data: { senderId: string; recipientId: string }) => {
      const recipientSocketId = Array.from(connectedUsers.entries())
        .find(([, id]) => id === data.recipientId)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', { senderId: data.senderId });
      }
    });

    socket.on('stop_typing', (data: { senderId: string; recipientId: string }) => {
      const recipientSocketId = Array.from(connectedUsers.entries())
        .find(([, id]) => id === data.recipientId)?.[0];

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('stop_typing', { senderId: data.senderId });
      }
    });

    socket.on('disconnect', async () => {
      const userId = connectedUsers.get(socket.id);
      if (userId) {
        await User.findByIdAndUpdate(userId, { isActive: false, lastSeen: new Date() });
        socket.broadcast.emit('user_status_changed', { userId, isActive: false });
        connectedUsers.delete(socket.id);
      }
      console.log('Client disconnected');
    });
  });

  return io;
};