import express from 'express';
import protectRoute from '../middleware/protectRoute';
import { getMessages, getUsersForSideBar, sendMessage } from '../controllers/message.controller';

const router = express.Router();

router.post('/send/:id', protectRoute, sendMessage);
router.get('/conversations', protectRoute, getUsersForSideBar);
router.get('/:id', protectRoute, getMessages);

export default router;