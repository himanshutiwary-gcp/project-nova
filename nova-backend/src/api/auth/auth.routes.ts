import { Router } from 'express';
import { handleGoogleLogin } from './auth.controller';
const router = Router();
router.post('/google', handleGoogleLogin);
router.post('/register', handleRegister);
export default router;
