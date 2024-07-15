import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db';
import { setupSocketIO } from './socket/socketHandler';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/auth';
import connectionRoutes from './routes/connections';
import messageRoutes from './routes/messages';
import userRoutes from './routes/user';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

const server = createServer(app);

setupSocketIO(server);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);


connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});