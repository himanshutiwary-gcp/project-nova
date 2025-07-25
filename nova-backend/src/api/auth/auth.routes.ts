import { Router } from 'express';
import { handleGoogleLogin } from './auth.controller';
import { handleRegister } from './register.controller'; // <-- THIS IMPORT WAS MISSING

const router = Router();

router.post('/google', handleGoogleLogin);
router.post('/register', handleRegister); // This line needs the import to work

export default router;
