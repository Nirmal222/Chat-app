import { Request, Response } from 'express';
import Message from '../models/message';
import { asyncHandler } from '../utils/asyncHandler';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { senderId, recipientId, content } = req.body;
  const message = new Message({ sender: senderId, recipient: recipientId, content });
  await message.save();
  res.status(201).json(message);
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 }
    ]
  }).sort('timestamp');
  res.json(messages);
});