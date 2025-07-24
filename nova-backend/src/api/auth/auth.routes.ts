import { Router } from 'express';
import { handleGoogleLogin } from './auth.controller';
const router = Router();
router.post('/google', handleGoogleLogin);
export default router;
