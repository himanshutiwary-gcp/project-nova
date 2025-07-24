import { Router } from 'express';
import { getPosts, createPost, toggleLike } from './post.controller';
import { protect } from '../middleware/auth.middleware';
const router = Router();

router.route('/').get(protect, getPosts).post(protect, createPost);
router.route('/:id/like').post(protect, toggleLike);

export default router;
