import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../../config/prisma';

// GET /api/posts - Get all APPROVED posts for the feed, with optional filtering
export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        // --- FIX: Safely handle the 'specialization' query parameter ---
        const { specialization: specializationQuery } = req.query;

        // Take only the first value if it's an array, otherwise use the string value.
        const specialization = Array.isArray(specializationQuery) 
            ? specializationQuery[0] 
            : specializationQuery;
        
        // Build the filter object
        const whereClause: { approved: boolean; specialization?: string } = {
            approved: true,
        };

        // If a specialization is provided, add it to the filter
        if (specialization) {
            whereClause.specialization = specialization;
        }

        const posts = await prisma.post.findMany({
            where: whereClause, // Use the dynamically built where clause
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
};
