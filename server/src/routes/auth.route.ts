import { Router } from 'express';
import { login, logout, signup, getMe } from '../controllers/auth.controller';
import protectRoute from '../middleware/protectRoute';
const router = Router();

// Estas rutas deberían funcionar ahora sin problemas
router.get('/me', protectRoute, getMe);
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);

export default router;
