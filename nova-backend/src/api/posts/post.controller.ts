import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../../config/prisma';

// GET /api/posts - Get all APPROVED posts for the feed
export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        // --- THIS IS THE KEY CHANGE ---
        // We now add a 'where' clause to only fetch approved posts.
        const posts = await prisma.post.findMany({
            where: { approved: true }, // Only get approved posts
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, name: true, pictureUrl: true, title: true }
                },
                likes: {
                    select: { userId: true }
                },
                _count: {
                    select: { likes: true }
                }
            }
        });

        const postsWithLikeStatus = posts.map(post => ({
            ...post,
            likedByMe: post.likes.some(like => like.userId === req.user?.id)
        }));

        res.status(200).json(postsWithLikeStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

// POST /api/posts - Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
    const { content } = req.body;
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    try {
        // --- THIS IS THE KEY CHANGE ---
        // The 'approved' field is now handled automatically by the schema's
        // @default(false) directive. We don't need to explicitly set it here.
        // Prisma is smart enough to apply the default.
        const newPost = await prisma.post.create({
            data: {
                content,
                authorId: req.user.id,
            },
            include: {
                author: {
                    select: { name: true, pictureUrl: true, title: true }
                }
            }
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post' });
    }
};

// POST /api/posts/:id/like - Like or unlike a post
export const toggleLike = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    try {
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId: id,
                }
            }
        });
        
        if (existingLike) {
            await prisma.like.delete({ where: { userId_postId: { userId: req.user.id, postId: id } }});
            res.status(200).json({ message: 'Post unliked' });
        } else {
            await prisma.like.create({
                data: {
                    userId: req.user.id,
                    postId: id,
                }
            });
            res.status(200).json({ message: 'Post liked' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling like' });
    }
}
