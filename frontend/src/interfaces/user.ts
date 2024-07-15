export interface IUser {
  _id: string;  
  username: string;
  email: string;
  password: string;
  lastSeen: Date;
  isActive: boolean;
}