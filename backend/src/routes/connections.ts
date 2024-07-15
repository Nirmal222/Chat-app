import express from 'express';
import { sendConnectionRequest, respondToConnectionRequest, getUserConnections, getUserConnection, getRequests } from '../controllers/connection';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/request', sendConnectionRequest);
router.put('/respond', respondToConnectionRequest);
router.get('/:userId', getUserConnections);
router.get('/:userId/:otherUserId', getUserConnection);
router.post("/requests", getRequests)

export default router;