import mongoose, { Model } from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastSeen: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false },
});

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;