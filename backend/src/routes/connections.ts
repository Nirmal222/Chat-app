import express from 'express';
import { sendConnectionRequest, respondToConnectionRequest, getUserConnections, getUserConnection, getRequests } from '../controllers/connection';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUserConnections);
router.get('/:userId/:otherUserId', getUserConnection);
router.post('/request', sendConnectionRequest);
router.patch('/respond', respondToConnectionRequest);
router.post('/requests', getRequests)

export default router;