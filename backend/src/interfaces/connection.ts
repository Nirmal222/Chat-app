import { Document, Types } from 'mongoose';

export interface IConnection extends Document {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
}