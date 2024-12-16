import { Router } from 'express';
import { login, logout, signup } from '../controllers/auth.controller';

const router = Router();

// Estas rutas deberían funcionar ahora sin problemas
router.get('me', protectRoute, getMe);
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', signup);

export default router;
