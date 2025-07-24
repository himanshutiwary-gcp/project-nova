import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma';

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });
};

export const handleGoogleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.name) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, picture } = payload;
        
        // Authorization check
        if (!email.endsWith('@google.com') && !email.endsWith('@cognizant.com')) {
          return res.status(403).json({ message: 'Access denied. Platform is for Google & Cognizant employees only.'});
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    pictureUrl: picture,
                },
            });
        } else {
            // Optionally update user info on every login
            user = await prisma.user.update({
                where: { email },
                data: { name, pictureUrl: picture },
            });
        }
        
        const jwtToken = generateToken(user.id);

        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            pictureUrl: user.pictureUrl,
            token: jwtToken,
        });

    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};
