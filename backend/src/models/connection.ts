  import mongoose, { Model } from 'mongoose';
  import { IConnection } from '../interfaces/connection';

  const ConnectionSchema = new mongoose.Schema<IConnection>({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }, { timestamps: true });

  ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

  ConnectionSchema.pre('save', function(next) {
    if (this.requester.toString() === this.recipient.toString()) {
      next(new Error('Cannot create a connection with yourself'));
    } else {
      next();
    }
  });

  const Connection: Model<IConnection> = mongoose.model<IConnection>('Connection', ConnectionSchema);

  export default Connection;