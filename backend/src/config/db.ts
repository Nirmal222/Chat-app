import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chat_app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;