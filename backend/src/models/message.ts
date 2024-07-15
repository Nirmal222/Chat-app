import mongoose, { Model } from 'mongoose';
import { IMessage } from '../interfaces/message';

const MessageSchema = new mongoose.Schema<IMessage>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;