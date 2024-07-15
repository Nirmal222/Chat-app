import express from 'express';
import { userController } from '../controllers/user';
import { authMiddleware } from '../middlewares/auth';
import { getRequests } from '../controllers/connection';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', userController.searchUsers);
router.get('/all', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);
router.post('/requests', getRequests)
export default router;
