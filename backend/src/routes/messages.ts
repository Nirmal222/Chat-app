import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/message';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/', sendMessage);
router.get('/chat/:userId1/:userId2', getChatHistory);

export default router;